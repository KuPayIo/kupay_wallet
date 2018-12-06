import { popNew } from '../../pi/ui/root';
import { requestAsync } from '../net/pull';
import { popNewMessage } from './tools';

export interface OrderDetail {
    total: number; // 总价
    body: string; // 信息
    num: number; // 充值GT数量
    payType: string; // 支付方式
    // tslint:disable-next-line:no-reserved-keywords
    type: number; // 充值类型
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
    const loading = popNew('app-components1-loading-loading', { text: { zh_Hans: '充值中...', zh_Hant: '充值中...', en: '' } });
    try {
        const resData: any = await requestAsync(msg);
        if (resData.result === 1) { // 下单成功
            const jumpData = {
                oid: resData.oid,
                mweb_url: ''
            };

            if (orderDetail.payType === 'alipay') {// 支付宝H5支付
                fetch('https://openapi.alipaydev.com/gateway.do', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    },
                    body: URLencode(resData.JsData)// 这里是请求对象
                }).then((res) => {
                    jumpData.mweb_url = res.url;
                    jumpPay(jumpData, okCb, failCb);
                }).catch((err) => {
                    failCb && failCb(err);
                });
            } else if (orderDetail.payType === 'wxpay') {// 微信H5支付
                jumpData.mweb_url = JSON.parse(resData.JsData).mweb_url;
                jumpPay(jumpData, okCb, failCb);
            }

        } else {
            failCb && failCb(resData);
        }
        loading.callback(loading.widget);
    } catch (err) {
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
 * 跳转微信、支付宝支付
 * @param order 订单支付跳转信息
 * @param okCb 成功回调
 * @param failCb 失败回调
 */
export const jumpPay = (order, okCb?: Function, failCb?: Function) => {
    const payIframe = document.createElement('iframe');
    payIframe.setAttribute('sandbox', 'allow-scripts allow-top-navigation');
    payIframe.setAttribute('src', order.mweb_url);
    payIframe.setAttribute('style', 'position:absolute;width:0px;height:0px;visibility:hidden;');
    document.body.appendChild(payIframe);
    setTimeout(() => {
        popNew('app-components1-modalBox-modalBox', {
            title: '',
            content: { zh_Hans: '请确认支付是否已完成？', zh_Hant: '请确认支付是否已完成？', en: '' },
            style: 'color:#F7931A;',
            sureText: { zh_Hans: '支付成功', zh_Hant: '支付成功', en: '' },
            cancelText: { zh_Hans: '重新支付', zh_Hant: '重新支付', en: '' }
        }, () => {
            okCb && okCb(order);
            document.body.removeChild(payIframe);
        }, () => {
            failCb && failCb();
            document.body.removeChild(payIframe);
        });
    }, 5000);
};

/**
 * 查询订单支付状态
 * @param oid 查询订单号
 * @param okCb 成功回调
 * @param failCb 失败回调
 */
export const queryPayState = async (oid: string, okCb?: Function, failCb?: Function) => {
    const msg = { type: 'order_query', param: { oid } };
    try {
        const resData: any = await requestAsync(msg);
        if (resData.result === 1) {
            okCb && okCb(resData);
        } else {
            failCb && failCb(resData);
        }
    } catch (err) {
        console.log('order_query--------', err);
        failCb && failCb(err);
    }
};

/**
 * 查询订单详情 
 * @param oid 查询订单号
 * @param okCb 成功回调
 * @param failCb 失败回调
 */
export const getOrderDetail = async (oid: string, okCb?: Function, failCb?: Function) => {
    if (!oid) {
        failCb && failCb('oid is not ready');

        return;
    }
    const msg = { type: 'get_order_detail', param: { oid } };
    try {
        const resData: any = await requestAsync(msg);
        if (resData.result === 1) {
            okCb && okCb(resData);
        } else {
            failCb && failCb(resData);
        }
    } catch (err) {
        console.log('get_order_detail--------', err);
        failCb && failCb(err);
    }
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
