import { popNew } from '../../pi/ui/root';
import { requestAsync } from '../net/pull';
import { popNewMessage } from './tools';

export interface OrderDetail {
    total:number; // 总价
    body:string; // 信息
    gt:number; // 充值GT数量
    payTypeId:payType; // 支付方式
}

export enum payType {
    wxPay = 1, // 微信H5支付
    aliPay = 2 // 支付宝H5支付
}

/**
 * 确认订单支付接口
 * @param orderDetail 订单详情
 * @param okCb 成功回调
 * @param failCb 失败回调
 */
export const confirmPay = async (orderDetail:OrderDetail,okCb?:Function,failCb?:Function) => {
    if (!checkOrder(orderDetail)) {
        failCb && failCb('order is not ready'); 

        return; 
    }
    const msg = { type: 'order_pay', param: orderDetail };
    const loading = popNew('app-components1-loading-loading', { text:{ zh_Hans:'充值中...',zh_Hant:'充值中...',en:'' } });        
    try {
        const resData:any = await requestAsync(msg);
        loading.callback(loading.widget);
        if (resData.result === 1) { 
            jumpPay(resData);
            loading.callback(loading.widget);
        } else {
            failCb && failCb(resData); 
        }
    } catch (err) {
        failCb && failCb(err); 
        loading.callback(loading.widget);
    }
};
/**
 * 检查订单
 * @param order 订单详情
 */
export const checkOrder = (order:OrderDetail):boolean => {
    if (!order.total) {
        
        return false; 
    }
    if (!order.gt) {
        
        return false; 
    }
    if (!order.payTypeId) {
        
        return false; 
    }
    if (!order.body) {
        
        return false; 
    }

    return true;
};

/**
 * 跳转微信、支付宝支付
 * @param order 订单支付跳转信息
 * @param okCb 成功回调
 * @param failCb 失败回调
 */
export const jumpPay = (order,okCb?:Function,failCb?:Function) => {
    const payIframe = document.createElement('iframe');
    // tslint:disable-next-line:max-line-length
    payIframe.setAttribute('src',JSON.parse(order.JsData).mweb_url);
    payIframe.setAttribute('style','position:absolute;width:0px;height:0px;visibility:hidden;');
    document.body.appendChild(payIframe);
    // tslint:disable-next-line:max-line-length
    // window.open('https://wx.tenpay.com/cgi-bin/mmpayweb-bin/checkmweb?prepay_id=wx28094712012894726428c3495256989632&package=3109440715&redirect_url=http%3a%2f%2fwxpay.wxutil.com%2fmch%2fpay%2fh5jumppage.php');
    popNew('app-components1-modalBox-modalBox', {
        title: '',
        content: { zh_Hans:'请确认支付是否已完成？',zh_Hant:'请确认支付是否已完成？',en:'' },
        style: 'color:#F7931A;',
        sureText: { zh_Hans:'支付成功',zh_Hant:'支付成功',en:'' },
        cancelText: { zh_Hans:'重新支付',zh_Hant:'重新支付',en:'' }
    },() => {
        document.body.removeChild(payIframe);
        okCb && okCb();    
    },() => {
        document.body.removeChild(payIframe);
        jumpPay(order);
    });
};

/**
 * 查询订单支付状态
 * @param data 查询订单号
 * @param okCb 成功回调
 * @param failCb 失败回调
 */
export const queryPayState = async (data,okCb?:Function,failCb?:Function) => {
    const msg = { type: 'query_pay_state', param: data };
    try {
        const resData:any = await requestAsync(msg);
        if (resData.result === 1) {
            okCb && okCb(resData);
        } else {
            failCb && failCb(resData);
        }
    } catch (err) {
        console.log('query_pay_state--------',err);
        failCb && failCb(err);
    }
};
