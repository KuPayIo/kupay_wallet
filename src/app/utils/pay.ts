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
export const walletPay = (order: any, callback: Function) => {
    
    openPayment(order, (res, msg) => {
        if (!res) {
            order.no_password = msg.no_password;
            console.log(msg);
            
            if (msg.no_password === 1) { // 已设置免密
                pay(order,(res1, msg1) => {
                    callback(res1,msg1);
                });
            } else {  // 未设置免密
                popNew('app-components1-modalBoxPay-pay',msg,(password) => {
                    const loading = popNew('app-components1-loading-loading', { text: '支付中...' });
                    order.password = password;
                    pay(order,(res1, msg1) => {
                        loading.callback(loading.widget);
                        callback(res1,msg1);
                    });
                },() => {
                    callback(resCode.USER_CANCAL,null);
                });
            }

        } else {
            callback(res,msg);
        }
    });
};

/**
 * 钱包内应用设置免密支付状态
 * @param appid 应用id
 * @param mchid 商户id 
 * @param noPSW 免密状态设置 0：不免密，1：免密
 */
export const walletSetNoPSW = async (appid:string,mchid:string,noPSW:number,callback:Function) => {
    const sendData = {
        appid,
        mchid,
        noPSW,
        password:''
    };
    const psw = await popPswBox();
    if (!psw) {return;}
    sendData.password = psw;
    const loading = popNew('app-components1-loading-loading', { text: '设置中...' });
    setNoPWD(sendData,(res,msg) => {
        loading.callback(loading.widget);
        callback(res,msg);
    });

};
