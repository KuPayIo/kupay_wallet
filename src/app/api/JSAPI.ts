/**
 * 授权、支付等API
 */
import { getServerCloudBalance, requestAsync } from '../net/pull';
import { CloudCurrencyType } from '../store/interface';
import { getCloudBalances } from '../store/memstore';
import { getWalletTools } from '../utils/commonjsTools';
import { formatBalance, getUserInfo } from '../utils/tools';

declare var pi_modules:any;

export enum resCode {
    SUCCESS = undefined,   // 成功
    INVALID_REQUEST = 101, // 参数缺失
    PASSWORD_ERROR = 102,  // 密码错误
    USER_CANCAL = 103,     // 用户取消
    OTHER_ERROR = 203      // 其他错误
}

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
export const openPayment = async (order: any, callback: Function) => {
    if (!order) {
        callback(resCode.INVALID_REQUEST, new Error('order is not available'));

        return;
    }
    if (typeof order !== 'string') {
        order = JSON.stringify(order);
    }
    const msg = { type: 'wallet/order@order_start', param: { json: order } };
    requestAsync(msg).then(resData => {
        if (resData.result === 1) {       // 开启支付成功
            const propData = {
                fee_total : resData.total_fee,
                desc : resData.body,
                fee_name : CloudCurrencyType[resData.fee_type],
                balance : formatBalance(getCloudBalances().get(resData.fee_type)),
                no_password:resData.no_password
            };
            callback(resCode.SUCCESS, propData);
        } else {
            callback(resData.result, resData);
        }
    }).catch(err => {
        callback(resCode.OTHER_ERROR, err);
    });

};

/**
 * 支付接口(输入密码进行支付)
 * @param psw 钱包密码
 * @param transactionId 交易id
 */
export const pay = async (order: any, callback: Function) => {
    if (!order) {
        callback(resCode.INVALID_REQUEST, new Error('order is not available'));

        return;
    }
    if (!order.password && order.no_password !== 1) {
        callback(resCode.INVALID_REQUEST, new Error('password is not available'));

        return;
    }

    // tslint:disable-next-line:one-variable-per-declaration
    let secretHash,signStr = '';
    const signJson = {
        appid: order.appid,
        transaction_id: order.transaction_id,
        nonce_str: Math.random().toFixed(5)
    };

    if (order.no_password !== 1) {
        const walletToolsMod = await getWalletTools();
        secretHash = await walletToolsMod.VerifyIdentidy(order.password);
        if (!secretHash) {  //  密码错误
            callback(resCode.PASSWORD_ERROR, null);
    
            return;
    
        }
        signStr = getSign(signJson, secretHash);
    }
    
    const msg = {
        type: 'wallet/order@pay',
        param: {
            ...signJson,
            sign: signStr,
            no_password:order.no_password
        }
    };
    requestAsync(msg).then(resData => {
        if (resData.result === 1) {
            getServerCloudBalance();
            callback(resCode.SUCCESS,resData);
        } else {
            callback(resData.result,resData);
        }  
    }).catch (err => {
        // console.log('pay--------',err);
        callback(resCode.OTHER_ERROR, err);
    });
};

/**
 * 查询免密支付
 * @param appid 应用id
 * @param callback 回调函数
 */
export const queryNoPWD = (appid:string,callback:Function) => {
    if (!appid) {
        callback(resCode.INVALID_REQUEST, new Error('appid is not available'));

        return;
    }
    const msg = {
        type: 'wallet/order@nopwd_limit',
        param: { appid }
    };
    requestAsync(msg).then(resData => {
        if (resData.result === 1) {
            callback(resCode.SUCCESS,resData);
        } else {
            callback(resData.result,resData);
        }  
    }).catch (err => {
        // console.log('pay--------',err);
        callback(resCode.OTHER_ERROR, err);
    });
};

/**
 * 设置免密支付
 * @param data 免密设置对象
 * @param callback 设置回调函数
 */
export const setNoPWD = async (data:any,callback:Function) => {
    if (!data.appid) {
        callback(resCode.INVALID_REQUEST, new Error('appid is not available'));

        return;
    }
    if (!data.mchid) {
        callback(resCode.INVALID_REQUEST, new Error('mchid is not available'));

        return;
    }
    if (data.noPSW === undefined || data.noPSW === null) {
        callback(resCode.INVALID_REQUEST, new Error('noPSW is not available'));

        return;
    }
    const walletToolsMod = await getWalletTools();
    const secretHash = await walletToolsMod.VerifyIdentidy(data.password);
    if (!secretHash) {  //  密码错误
        callback(resCode.PASSWORD_ERROR, null);

        return;

    }

    const signJson = {
        appid: data.appid,
        mch_id: data.mchid,
        nonce_str: Math.random().toFixed(5)
    };
    const signStr = getSign(signJson, secretHash);
    const msg = {
        type: 'wallet/order@set_nopwd',
        param:{
            ...signJson,
            user_sign:signStr,
            no_password:data.noPSW
        }
    };
    requestAsync(msg).then(resData => {
        if (resData.result === 1) {
            callback(resCode.SUCCESS,resData);
        } else {
            callback(resData.result,resData);
        }  
    }).catch (err => {
        // console.log('pay--------',err);
        callback(resCode.OTHER_ERROR, err);
    });

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
