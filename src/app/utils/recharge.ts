/**
 * 微信、支付宝充值模块
 */

import { WebViewManager } from '../../pi/browser/webview';
import { popNew } from '../../pi/ui/root';
import { getModulConfig } from '../modulConfig';
import { requestAsync } from '../net/pull';
import { showError } from './toolMessages';
import { popNewLoading, popNewMessage } from './tools';

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
    Alipay = 'alipay'
}
/**
 * 确认订单支付接口
 * @param orderDetail 订单详情
 * @param okCb 成功回调
 * @param failCb 失败回调
 */
export const confirmPay = async (orderDetail: OrderDetail, okCb?: Function, failCb?: Function) => {
    if (!checkOrder(orderDetail)) {
        failCb && failCb('order is not ready');

        return;
    }

    const msg = { type: 'order_pay', param: orderDetail };
    const loading = popNewLoading({ zh_Hans: '充值中...', zh_Hant: '充值中...', en: '' });
    try {
        const resData: any = await requestAsync(msg);
        console.log('pay 下单结果===============',resData);
        if (resData.result === 1) { // 下单成功
            const jumpData = {
                oid: resData.oid,
                mweb_url: ''
            };

            if (orderDetail.payType === PayType.Alipay) {// 支付宝H5支付
                fetch('https://openapi.alipay.com/gateway.do', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    },
                    body: URLencode(resData.JsData)// 这里是请求对象
                }).then((res) => {
                    jumpData.mweb_url = res.url;
                    jumpAlipay(jumpData, okCb, failCb);
                }).catch((err) => {
                    failCb && failCb(err);
                });
            } else if (orderDetail.payType === PayType.WX) { // 微信H5支付
                jumpData.mweb_url = JSON.parse(resData.JsData).mweb_url;
                jumpWxpay(jumpData, okCb, failCb);
            }

        } else {
            showError(resData.result);
            failCb && failCb(resData);
        }
        setTimeout(() => {
            loading.callback(loading.widget);
        }, 5000);
    } catch (err) {
        showError(err && (err.result || err.type));
        failCb && failCb(err);
        loading.callback(loading.widget);
    }
};
/**
 * 检查订单
 * @param order 订单详情
 */
export const checkOrder = (order: OrderDetail): boolean => {
    if (!order.total) {

        return false;
    }
    if (!order.num) {

        return false;
    }
    if (!order.payType) {

        return false;
    }
    if (!order.body) {

        return false;
    }

    return true;
};

/**
 * 跳转微信支付
 * @param order 订单支付跳转信息
 * @param okCb 成功回调
 * @param failCb 失败回调
 */
export const jumpWxpay = (order, okCb?: Function, failCb?: Function) => {

    WebViewManager.newView('payWebView',order.mweb_url,{ Referer: getModulConfig('PAY_DOMAIN') });
    setTimeout(() => {
        popNew('app-components-modalBox-modalBox', {
            title: '',
            content: { zh_Hans: '请确认支付是否已完成？', zh_Hant: '请确认支付是否已完成？', en: '' },
            style: 'color:#F7931A;',
            sureText: { zh_Hans: '支付成功', zh_Hant: '支付成功', en: '' },
            cancelText: { zh_Hans: '重新支付', zh_Hant: '重新支付', en: '' }
        }, () => {
            okCb && okCb(order);
            WebViewManager.freeView('payWebView');
        }, () => {
            failCb && failCb();
            WebViewManager.freeView('payWebView');
        });
    }, 5000);
};

/**
 * 跳转支付宝支付
 * @param order 订单支付跳转信息
 * @param okCb 成功回调
 * @param failCb 失败回调
 */
export const jumpAlipay = (order, okCb?: Function, failCb?: Function) => {
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
            okCb && okCb(order);
            document.body.removeChild($payIframe);
        }, () => {
            failCb && failCb();
            document.body.removeChild($payIframe);
        });
    }, 5000);
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
 * 获取订单详情
 * @param oid 订单号
 */
export const getOrderLocal = (transactionId: string) => {
    const msg = { type: 'wallet/order@order_query_local', param: { transaction_id:transactionId } };
    
    return requestAsync(msg);
     
};