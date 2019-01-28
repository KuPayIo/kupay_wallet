/**
 * 钱包应用支付模块
 */

import { popNew } from '../../pi/ui/root';
import { openPayment, pay, resCode, setNoPWD } from '../api/JSAPI';
import { popPswBox } from './tools';

/**
 * 钱包支付，钱包内应用调用
 * @param order 后台返回订单数据
 * @param callback 回调函数
 */
export const walletPay = (order: any, appid: string, mchid: string, callback: Function) => {

    openPayment(order, (res, msg) => {
        if (!res) { // 开启订单支付成功(预支付)
            order.no_password = msg.no_password;
            console.log(msg);

            if (msg.no_password === 1) { // 已设置免密
                pay(order, (res1, msg1) => {
                    callback(res1, msg1);
                });
            } else {                    // 未设置免密
                console.log('未设置免密支付', order);
                popNew('app-components1-modalBoxPay-pay', msg, (password) => {
                    const loading = popNew('app-components1-loading-loading', { text: '支付中...' });
                    order.password = password;
                    pay(order, (res1, msg1) => {
                        loading.callback(loading.widget);
                        callback(res1, msg1);
                        if (order.isFirst === 1 && !res1) { // 应用内第一次支付成功后提示开通免密
                            popNew('app-components1-modalBox-modalBox', {
                                title: { zh_Hans: '是否开通免密支付？', zh_Hant: '是否開通免密支付?', en: '' },
                                content: { zh_Hans: '累计未超过20ST不再验证密码，超过后直至下个20ST。', zh_Hant: '累計未超過20ST不再驗證密碼，超過後直至下個20ST。', en: '' },
                                sureText: { zh_Hans: '开通', zh_Hant: '开通', en: '' }
                            }, () => {
                                const sendData = {
                                    appid,
                                    mchid,
                                    noPSW: 1,
                                    password
                                };
                                const loading1 = popNew('app-components1-loading-loading', { text: '设置中...' });
                                setNoPWD(sendData, (res, msg) => {
                                    loading1.callback(loading1.widget);
                                    if(!res){
                                        popNew('app-components1-message-message',{ content:{"zh_Hans":"设置成功！","zh_Hant":"設置成功！","en":""} });
                                    }else{
                                        popNew('app-components1-message-message',{ content:{"zh_Hans":"设置失败！","zh_Hant":"設置失败！","en":""} });
                                    }
                                });
                            }, () => {

                            });
                        }
                    });
                }, () => {
                    callback(resCode.USER_CANCAL, null);
                });
            }

        } else {
            callback(res, msg);
        }
    });
};

/**
 * 钱包内应用设置免密支付状态
 * @param appid 应用id
 * @param mchid 商户id 
 * @param noPSW 免密状态设置 0：不免密，1：免密
 */
export const walletSetNoPSW = async (appid: string, mchid: string, noPSW: number, callback: Function) => {
    const sendData = {
        appid,
        mchid,
        noPSW,
        password: ''
    };
    const psw = await popPswBox();
    if (!psw) { return; }
    sendData.password = psw;
    const loading = popNew('app-components1-loading-loading', { text: '设置中...' });
    setNoPWD(sendData, (res, msg) => {
        loading.callback(loading.widget);
        callback(res, msg);
    });

};
