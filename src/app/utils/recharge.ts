/**
 * 微信、支付宝充值模块
 */

import { getStore as earnGetStore, setStore  as earnSetStore } from '../../earn/client/app/store/memstore';
import { IAPManager } from '../../pi/browser/iap_manager';
import { WebViewManager } from '../../pi/browser/webview';
import { popNew } from '../../pi/ui/root';
import { getModulConfig } from '../modulConfig';
import { requestAsync } from '../net/pull';
import { popNewLoading } from './tools';

export interface OrderDetail {
    total: number; // 总价
    body: string; // 信息
    num: number; // 充值GT数量
    payType: PayType; // 支付方式
    cointype: number; // 充值类型
    note?:string;     // 备注
}

/**
 * 支付方式
 */
export enum PayType {
    WX = 'wxpay',
    Alipay = 'alipay',
    IOS = 'apple_pay'
}
/**
 * 确认订单支付接口
 * @param orderDetail 订单详情
 * @param okCb 成功回调
 * @param failCb 失败回调
 */
export const confirmPay = async (orderDetail: OrderDetail,appleGood?:string) => {
    const msg = { type: 'order_pay', param: orderDetail };
    const loading = popNewLoading({ zh_Hans: '充值中...', zh_Hant: '充值中...', en: '' });
    try {
        const resData: any = await requestAsync(msg);
        console.log('pay 下单结果===============',resData);
        setTimeout(() => {
            loading.callback(loading.widget);
        },3000);
        const jumpData = {
            oid: resData.oid,
            mweb_url: ''
        };
        let retOrder = null;
        if (orderDetail.payType === PayType.Alipay) {// 支付宝H5支付
            const aliRes = await fetch('https://openapi.alipay.com/gateway.do', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body: URLencode(resData.JsData)// 这里是请求对象
            });
            jumpData.mweb_url = aliRes.url;
            retOrder = await jumpAlipay(jumpData);

        } else if (orderDetail.payType === PayType.WX) { // 微信H5支付
            jumpData.mweb_url = JSON.parse(resData.JsData).mweb_url;
            retOrder = await jumpWxpay(jumpData);

        } else if (orderDetail.payType === PayType.IOS) {  // ios支付
            console.log('打开苹果支付======',appleGood,orderDetail);
            IAPManager.IAPurchase({
                sm: appleGood,
                sd: resData.oid,
                success(str: String) {
                    console.log('打开苹果支付成功========', str);
                }
            });
            
        }
        
        return retOrder;
    } catch (err) {
        loading.callback(loading.widget);
    }
};

/**
 * 跳转微信支付
 * @param order 订单支付跳转信息
 */
export const jumpWxpay = (order) => {
    return new Promise((resolve,reject) => {
        WebViewManager.newView('payWebView',order.mweb_url,{ Referer: getModulConfig('PAY_DOMAIN') });
        setTimeout(() => {
            popNew('app-components-modalBox-modalBox', {
                title: '',
                content: { zh_Hans: '请确认支付是否已完成？', zh_Hant: '请确认支付是否已完成？', en: '' },
                style: 'color:#F7931A;',
                sureText: { zh_Hans: '支付成功', zh_Hant: '支付成功', en: '' },
                cancelText: { zh_Hans: '重新支付', zh_Hant: '重新支付', en: '' }
            }, () => {
                WebViewManager.freeView('payWebView');
                const firstRecharge = earnGetStore('flags').firstRecharge;
                if (!firstRecharge) earnSetStore('flags/firstRecharge',true);
                resolve(order);
            }, () => {
                WebViewManager.freeView('payWebView');
                reject();
            });
        }, 5000);
    });
    
};

/**
 * 跳转支付宝支付
 * @param order 订单支付跳转信息
 * @param okCb 成功回调
 * @param failCb 失败回调
 */
export const jumpAlipay = (order) => {
    return new Promise((resolve,reject) => {
        const $payIframe = document.createElement('iframe');
        $payIframe.setAttribute('sandbox', 'allow-scripts allow-top-navigation');
        $payIframe.setAttribute('src', order.mweb_url);
        $payIframe.setAttribute('style', 'position:absolute;width:0px;height:0px;visibility:hidden;');
        document.body.appendChild($payIframe);
        setTimeout(() => {
            popNew('app-components-modalBox-modalBox', {
                title: '',
                content: { zh_Hans: '请确认支付是否已完成？', zh_Hant: '请确认支付是否已完成？', en: '' },
                style: 'color:#F7931A;',
                sureText: { zh_Hans: '支付成功', zh_Hant: '支付成功', en: '' },
                cancelText: { zh_Hans: '重新支付', zh_Hant: '重新支付', en: '' }
            }, () => {
                document.body.removeChild($payIframe);
                const firstRecharge = earnGetStore('flags').firstRecharge;
                if (!firstRecharge) earnSetStore('flags/firstRecharge',true);
                resolve(order);
            }, () => {
                document.body.removeChild($payIframe);
                reject();
            });
        }, 5000);
    });
    
};

/**
 * 查询订单详情 
 * @param oid 查询订单号
 * @param okCb 成功回调
 * @param failCb 失败回调
 */
export const getOrderDetail = async (oid: string) => {
    const msg = { type: 'get_order_detail', param: { oid } };
    
    return requestAsync(msg);
};

/**
 * 特殊字符转码
 * @param sStr str
 */
const URLencode = (sStr) => {
    const signStr = sStr.split('&');
    // tslint:disable-next-line:max-line-length
    signStr[0] = `sign=${escape(signStr[0].slice(5)).replace(/\+/g, '%2B').replace(/\"/g, '%22').replace(/\'/g, '%27').replace(/\//g, '%2F')}`;

    return signStr.join('&');
};

/**
 * 获取订单详情 通过pay支付收入的订单
 * @param oid 订单号
 */
export const getOrderLocal = (transactionId: string) => {
    const msg = { type: 'wallet/order@order_query_local', param: { transaction_id:transactionId } };
    
    return requestAsync(msg);
     
};