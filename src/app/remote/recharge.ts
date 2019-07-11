import { closePayView, goiOSPay, gopay, payPlatform } from '../../pi/browser/vm';
import { erlangLogicPayPort, SCUnitprice, sourceIp, wxPayShow } from '../publicLib/config';
import { CloudCurrencyType, TaskSid } from '../publicLib/interface';
import { piFetch } from '../publicLib/tools';
import { requestAsync } from './login';

/**
 * 充值模块
 */

export interface OrderDetail {
    total: number; // 总价
    body: string; // 信息
    num: number; // 充值GT数量
    payType: payPlatform; // 支付方式
    cointype: number; // 充值类型
    note?:string;     // 备注
}

/**
 * 去充值页面
 */
export const goRecharge = async (balance:number,muchNeed:number) => {
    try {
        const { conpay, sMD, platform } = await openRechargePage(balance,muchNeed);
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
        
        const resData = await confirmPay(orderDetail);
        if (orderDetail.payType === payPlatform.apple_pay) {  // ios支付
            console.log('打开苹果支付======',orderDetail);
            const { sID,trans } = await iOSPay(resData.oid,sMD);
            const res = await confirmApplePay(sID,trans);
            if (res.result === 'SUCCESS') {
                const ret = {
                    oid:resData.oid,
                    itype:TaskSid.Apple_pay
                };
    
                return [undefined,ret];
            } else {
                return [res];
            }
        }
    } catch (err) {
        return [err];
    } finally {
        closePayView();
    }
    
};

/**
 * 打开充值页面
 */
const openRechargePage = (balance:number,muchNeed:number):Promise<any> => {
    return new Promise((resolve,reject) => {
        gopay(balance,muchNeed,(conpay:number, sMD:any, platform: payPlatform) => {
            resolve({ conpay,sMD,platform });    // 点击充值按钮的时候触发
        },() => {
            reject(new Error('gopay failed'));   
        });
    });
};

/**
 * 确认订单支付接口
 * @param orderDetail 订单详情
 * @param okCb 成功回调
 * @param failCb 失败回调
 */
const confirmPay = (orderDetail: OrderDetail) => {
    const msg = { type: 'order_pay', param: orderDetail };

    return requestAsync(msg);
};

/**
 * ios支付
 * @param oid 订单id 
 * @param sMD iOS支付时所需参数
 */
const iOSPay = (oid:string,sMD:any):Promise<any> => {
    return new Promise((resolve,reject) => {
        goiOSPay(oid,sMD,(sID:string,trans:string) => {
            console.log('支付成功',sID);
            resolve({ sID,trans });
        },() => {
            console.log('支付失败');
            reject(new Error('ios pay failed'));
        });
    });
};

/**
 * 验证iOS是否支付成功
 */
const confirmApplePay = (oid:string,receipt:string) => {
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