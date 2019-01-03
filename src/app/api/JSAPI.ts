/**
 * 授权、支付等API
 */
import { popNew } from '../../pi/ui/root';
import { requestAsync } from '../net/pull';
import { getUserInfo } from '../utils/tools';
import { VerifyIdentidy } from '../utils/walletTools';

declare var pi_modules:any;

/**
 * 授权接口
 * @param payload 需要授权内容 
 * @param callback 回调
 */
export const authorize = (payload, callback) => {
    console.log('authorize called',payload);
    getOpenId(payload.appId,(res) => {
        const ret:any = {};
        ret.openId = res.openid;
        if (payload.avatar) {
            ret.avatar = getUserInfo().avatar;
        }
        if (payload.nickName) {
            ret.nickName = getUserInfo().nickName;
        }
        callback(undefined,ret);
    },(err) => {
        callback(err);
    });
};

/**
 * 授权用户openID接口
 * @param appId appId 
 * @param okCb 成功回调 
 * @param failCb 失败回调
 */
export const getOpenId = (appId:string,okCb:Function,failCb?:Function) => {
    if (!appId) {
        failCb && failCb(new Error('appId is not available'));

        return;
    }
    // const authorize = JSON.parse(localStorage.getItem('authorize')) || {};
    // if (authorize[appId]) {
    //     okCb && okCb(authorize[appId]);

    //     return;
    // }
    const msg = { type: 'get_openid', param: { appid:appId } };
    requestAsync(msg).then(resData => {
        // authorize[appId] = resData;
        // localStorage.setItem('authorize',JSON.stringify(authorize));
        okCb && okCb(resData);
    }).catch(err => {
        failCb && failCb(err); 
    });
    
    // popNew('app-components1-modalBox-modalBox', {
    //     title: { zh_Hans:'是否授权',zh_Hant:'是否授權',en:'' },
    //     content: { zh_Hans:'授权成功将获取您的基本信息',zh_Hant:'授權成功將獲取您的基本信息',en:'' },
    //     sureText: { zh_Hans:'授权',zh_Hant:'授權',en:'' },
    //     cancelText: { zh_Hans:'取消',zh_Hant:'取消',en:'' }
    // },async () => {
    //     const msg = { type: 'get_openid', param: { appid:appId } };
    //     const close = popNew('app-components1-loading-loading', { text:'授权中...' });        
    //     try {
    //         const resData:any = await requestAsync(msg);
    //         close.callback(close.widget);
    //         if (resData.result === 1) {
    //             authorize[appId] = resData;
    //             localStorage.setItem('authorize',JSON.stringify(authorize));
    //             okCb && okCb(resData);
    //         } else {
    //             failCb && failCb(resData); 
    //         }
            
    //     } catch (err) {
    //         console.log('get_openid--------',err);
    //         failCb && failCb(err); 
    //         close.callback(close.widget);
    //     }
    // },() => {
    //     failCb && failCb(new Error('Deauthorization'));
    // });
};

/**
 * 启动支付接口(验证订单，展示订单信息)
 * @param order 订单信息,后台返回的订单json
 */
export const openPayment = async (order:any,okCb?:Function,failCb?:Function) => {    
    if (!order) {
        failCb && failCb(new Error('order is not available'));

        return;
    }
    if (typeof order !== 'string') {
        order = JSON.stringify(order);
    }
    const msg = { type: 'wallet/order@order_start', param: { json:order } };        
    try {
        const resData:any = await requestAsync(msg);
        if (resData.result === 1) {
            popNew('app-components1-modalBoxInput-modalBoxInput', {
                title: '输入密码',
                content: [`商品：${resData.body}`,`总额：${resData.total_fee}GT`],
                itype: 'password'
            },async (r) => {
                const loading = popNew('app-components1-loading-loading', { text:'支付中...' });
                const secretHash = await VerifyIdentidy(r);
                
                loading.callback(loading.widget);
                if (secretHash) {
                    pay(JSON.parse(order),secretHash,okCb,failCb);
                } else {
                    popNew('app-components1-message-message', { content:'密码错误' });
                    openPayment(order,okCb,failCb);
                }
            },() => {
                failCb && failCb(new Error('transactionId is not available'));
    
            });
        } else {
            failCb && failCb(resData); 
        }
            
    } catch (err) {
        // console.log('order_start--------',err);
        failCb && failCb(err); 
       
    }
    
};

/**
 * 支付接口(输入密码进行支付)
 * @param psw 钱包密码
 * @param transactionId 交易id
 */
export const pay = async (order:any,secretHash:string,okCb?:Function,failCb?:Function) => {
    if (!order) {
        failCb && failCb(new Error('transactionId is not available'));

        return;
    }
    const json = {
        appid:order.appid,
        transaction_id:order.transaction_id,
        nonce_str:Math.random().toFixed(5)
    };
    const signStr = getSign(json,secretHash);
    const msg = { 
        type: 'wallet/order@pay', 
        param: {
            appid:json.appid,
            transaction_id:json.transaction_id,
            nonce_str:json.nonce_str,
            sign:signStr
        } 
    };
    try {
        const resData:any = await requestAsync(msg);
        if (resData.result === 1) {
            okCb && okCb(resData);
        } else {
            failCb && failCb(resData); 
        }  
    } catch (err) {
        // console.log('pay--------',err);
        failCb && failCb(err); 
    } 
};

/**
 * 关闭交易
 * @param transactionId 交易id
 */
export const closePayment = async (transactionId:string,okCb?:Function,failCb?:Function) => {
    if (!transactionId) {
        failCb && failCb(new Error('transactionId is not available'));

        return;
    }
    const msg = { type: 'wallet/order@close_order', param: { transaction_id:transactionId } };
    try {
        const resData:any = await requestAsync(msg);
        if (resData.result !== 1) {
            failCb && failCb(new Error('closePayment is failed'));
        } else {
            okCb && okCb();
        }
    } catch (err) {
        failCb && failCb(new Error('closePayment is failed'));
    }
};

/**
 * 获取签名
 * @param json 签名json
 */
const getSign = (json:any,secretHash:string) => {

    const getMnemonicByHash = pi_modules.commonjs.exports.relativeGet('app/utils/walletTools').exports.getMnemonicByHash;
    const mnemonic = getMnemonicByHash(secretHash);
    const GlobalWallet = pi_modules.commonjs.exports.relativeGet('app/core/globalWallet').exports.GlobalWallet;
    const wlt = GlobalWallet.createWltByMnemonic(mnemonic,'ETH',0);
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
