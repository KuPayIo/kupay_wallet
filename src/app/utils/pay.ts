/**
 * 钱包应用支付模块
 */

import { popNew } from "../../pi/ui/root";
import { resCode, openPayment, pay } from "../api/JSAPI";


declare var pi_modules: any;

export const walletPay = (order: any, callback: Function) => {
    
    openPayment(order, (res, msg) => {
        if (res === 1) {
            popNew("app-components1-modalBoxPay-pay",msg,(password)=>{
                const loading = popNew('app-components1-loading-loading', { text: '支付中...' });
                order.password = password;
                pay(order,(res1, msg1)=>{
                    loading.callback(loading.widget);
                    callback(res1,msg1);
                });
            },()=>{
                callback(resCode.USER_CANCAL,null);
            });
        }else{
            callback(res,msg);
        }
    })
}



/**
 * 启动支付接口(验证订单，展示订单信息)
 * @param order 订单信息,后台返回的订单json
 */
// export const openPayment = async (order: any, callback: Function) => {
//     if (!order) {
//         callback(resCode.INVALID_REQUEST, new Error('order is not available'));

//         return;
//     }
//     if (typeof order !== 'string') {
//         order = JSON.stringify(order);
//     }
//     const msg = { type: 'wallet/order@order_start', param: { json: order } };
//     requestAsync(msg).then(resData => {
//         if (resData.result === 1) {       //开启支付成功
//             callback(resCode.SUCCESS, resData);
//         } else {
//             callback(resCode.OTHER_ERROR, resData);
//         }
//     }).catch(err => {
//         callback(resCode.OTHER_ERROR, err);
//     });

// };

/**
 * 支付接口(输入密码进行支付)
 * @param psw 钱包密码
 * @param transactionId 交易id
 */
// export const pay = async (order: any, password: string, callback: Function) => {
//     if (!order) {
//         callback(resCode.INVALID_REQUEST, new Error('order is not available'));

//         return;
//     }
//     if (!password) {
//         callback(resCode.INVALID_REQUEST, new Error('password is not available'));

//         return;
//     }
//     const secretHash = await VerifyIdentidy(password);
//     if (!secretHash) {
//         callback(resCode.PASSWORD_ERROR, null);

//         return;

//     }

//     const signJson = {
//         appid: order.appid,
//         transaction_id: order.transaction_id,
//         nonce_str: Math.random().toFixed(5)
//     };
//     const signStr = getSign(signJson, secretHash);
//     const msg = {
//         type: 'wallet/order@pay',
//         param: {
//             ...signJson,
//             sign: signStr
//         }
//     };
//     requestAsync(msg).then(resData => {
//         if (resData.result === 1) {
//             callback(resCode.SUCCESS,resData);
//         } else {
//             callback(resCode.OTHER_ERROR,resData);
//         }
//     }).catch(err => {
//         callback(resCode.OTHER_ERROR, err);
//     });

// };

/**
 * 关闭交易
 * @param transactionId 交易id
 */
// export const closePayment = async (transactionId: string, okCb?: Function, failCb?: Function) => {
//     if (!transactionId) {
//         failCb && failCb(new Error('transactionId is not available'));

//         return;
//     }
//     const msg = { type: 'wallet/order@close_order', param: { transaction_id: transactionId } };
//     try {
//         const resData: any = await requestAsync(msg);
//         if (resData.result !== 1) {
//             failCb && failCb(new Error('closePayment is failed'));
//         } else {
//             okCb && okCb();
//         }
//     } catch (err) {
//         failCb && failCb(new Error('closePayment is failed'));
//     }
// };

/**
 * 获取签名
 * @param json 签名json
 */
const getSign = (json: any, secretHash: string) => {

    const getMnemonicByHash = pi_modules.commonjs.exports.relativeGet('app/utils/walletTools').exports.getMnemonicByHash;
    const mnemonic = getMnemonicByHash(secretHash);
    const GlobalWallet = pi_modules.commonjs.exports.relativeGet('app/core/globalWallet').exports.GlobalWallet;
    const wlt = GlobalWallet.createWltByMnemonic(mnemonic, 'ETH', 0);
    const sign = pi_modules.commonjs.exports.relativeGet('app/core/genmnemonic').exports.sign;

    return sign(jsonUriSort(json), wlt.exportPrivateKey());
};

/**
 * 拼接字符串为uri并按照字典排序;
 * @param json 拼接json
 */
const jsonUriSort = (json) => {
    const keys = Object.keys(json).sort();
    let msg = '';
    for (const index in keys) {
        const key = keys[index];
        if (msg === '') {
            msg += `${key}=${json[key]}`;
        } else {
            msg += `&${key}=${json[key]}`;
        }
    }

    return msg;
};