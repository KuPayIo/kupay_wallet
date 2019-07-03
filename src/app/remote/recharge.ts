import { goiOSPay, gopay, payPlatform } from '../../pi/browser/vm';
import { erlangLogicPayPort, SCUnitprice, sourceIp, wxPayShow } from '../publicLib/config';
import { CloudCurrencyType } from '../publicLib/interface';
import { piFetch } from '../publicLib/tools';
import { requestAsync } from './login';

/**
 * 充值模块
 */

/**
 * 去充值页面
 */
export const goRecharge = (balance:number) => {
    return new Promise((resolve,reject) => {
        gopay(balance,(conpay:number, sMD:any, platform: payPlatform) => {
            console.log('充值数量',conpay);
            console.log('充值参数',sMD);
            console.log('充值方式',platform);
            const orderDetail:OrderDetail = {
                total: conpay * SCUnitprice, // 总价
                body: wxPayShow, // 信息
                num:conpay, // 充值SC数量
                payType: platform, // 支付方式
                cointype: CloudCurrencyType.SC, // 充值类型
                note: ''          // 备注
            };
            confirmPay(orderDetail,sMD);
            resolve({ conpay,sMD,platform });
        },() => {
            reject();  
        });
    });
};

export interface OrderDetail {
    total: number; // 总价
    body: string; // 信息
    num: number; // 充值GT数量
    payType: payPlatform; // 支付方式
    cointype: number; // 充值类型
    note?:string;     // 备注
}

/**
 * 确认订单支付接口
 * @param orderDetail 订单详情
 * @param okCb 成功回调
 * @param failCb 失败回调
 */
export const confirmPay = async (orderDetail: OrderDetail,sMD:any) => {
    const msg = { type: 'order_pay', param: orderDetail };
    try {
        const resData: any = await requestAsync(msg);
        console.log('pay 下单结果===============',resData);
        // const jumpData = {
        //     oid: resData.oid,
        //     mweb_url: ''
        // };
        // let retOrder;
        if (orderDetail.payType === payPlatform.aliPay) {// 支付宝H5支付
            // const aliRes = await fetch('https://openapi.alipay.com/gateway.do', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            //     },
            //     body: URLencode(resData.JsData)// 这里是请求对象
            // });
            // jumpData.mweb_url = aliRes.url;
            // retOrder = await jumpAlipay(jumpData);
        } else if (orderDetail.payType === payPlatform.wxpay) { // 微信H5支付
            // jumpData.mweb_url = JSON.parse(resData.JsData).mweb_url;
            // retOrder = await jumpWxpay(jumpData);
        } else if (orderDetail.payType === payPlatform.apple_pay) {  // ios支付
            console.log('打开苹果支付======',orderDetail);
            iOSPay(resData.oid,sMD);
        }
        
        // return retOrder;
    } catch (err) {
        console.log('下单失败',err);
    }
};

const iOSPay = (oid:string,sMD:any) => {
    return new Promise((resolve,reject) => {
        goiOSPay(oid,sMD,(sID:string,trans:string) => {
            console.log('支付成功',sID);
            // console.log('支付成功凭证',trans);
            confirmApplePay(sID,trans);
            resolve();
        },() => {
            console.log('支付失败');
            reject();
        });
    });
};

/**
 * 验证iOS是否支付成功
 */
export const confirmApplePay = (oid:string,receipt:string) => {
    const url = `http://${sourceIp}:${erlangLogicPayPort}/pay/apple_verify`;
    
    return piFetch(url, {
        body: `orderId=${oid}&receipt=${JSON.stringify(encodeURIComponent(receipt))}`, 
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json'
        },
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors' // no-cors, cors, *same-origin
    });
};