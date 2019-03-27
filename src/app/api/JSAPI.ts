/**
 * 授权、支付等API
 */
import { sign } from '../core/genmnemonic';
import { GlobalWallet } from '../core/globalWallet';
import { requestAsync } from '../net/pull';
import { CloudCurrencyType } from '../store/interface';
import { getCloudBalances } from '../store/memstore';
import { currencyType, formatBalance, getUserInfo } from '../utils/tools';
import { getMnemonicByHash, VerifyIdentidy } from '../utils/walletTools';

export enum resCode {
    SUCCESS = undefined,   // 成功
    INVALID_REQUEST = 101, // 参数缺失
    PASSWORD_ERROR = 102,  // 密码错误
    USER_CANCAL = 103,     // 用户取消
    OTHER_ERROR = 203      // 其他错误
}
export enum SetNoPassword {
    NOSETED = 0,   // 未设置
    SETED = 1,    // 设置
    EXCEEDLIMIT = 2  // 设置但超出每日限额
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
 * 查询是否开启免密支付
 */
export const querySetNoPassword = (appid, callback) => {
    queryNoPWD(appid).then(setNoPassword => {
        if (setNoPassword === SetNoPassword.NOSETED) {
            callback(undefined,false);
        } else {
            callback(undefined,true);
        }
    });
    
};

/**
 * 设置免密支付
 */
export const setFreeSecrectPay = (payload,callback) => {
    VerifyIdentidy(payload.password).then(secretHash => {
        if (!secretHash) {  //  密码错误
            callback(resCode.PASSWORD_ERROR, false);
    
            return;
    
        }
        setNoPWD(payload.appid,payload.noPSW,secretHash).then(() => {
            callback(undefined, true);
        }).catch(err => {
            callback(err, false);
        });
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
    
    // popNew('app-components-modalBox-modalBox', {
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
 * 统一订单
 */
export interface ThirdOrder {
    appid:string; // 应用id
    transaction_id:string;   // 钱包订单ID
    nonce_str:string;    // 随机字符串
    sign:string;     // 签名
}
/**
 * 第三方支付
 */
export const thirdPay = async () => {
    try {
        const resData = await openPayment(order);
        const orderDetail = {
            fee_total : resData.total_fee,
            desc : resData.body,
            fee_name : currencyType(CloudCurrencyType[resData.fee_type]),
            balance : formatBalance(getCloudBalances().get(resData.fee_type))
        };
        const setNoPassword = await queryNoPWD(order.appid,orderDetail.fee_total);
        const scBalance = getCloudBalances().get(CloudCurrencyType.SC);
        const secretHash = await VerifyIdentidy('123456789');
        const payRes = await walletPay(order,secretHash);

        console.log('支付成功===========',payRes);
        
        return [undefined,payRes];
    } catch (err) {
        console.log('thirdPay err =====',err);

        return [err];
    }
    
    // popNew3('app-view-wallet-cloudWalletSC-thirdRechargeSC',{ order });
};

/**
 * 启动支付接口(验证订单，展示订单信息)
 * @param order 订单信息,后台返回的订单json
 */
const openPayment = (order: any) => {
    const orderStr = JSON.stringify(order);
    const msg = { type: 'wallet/order@order_start', param: { json: orderStr } };

    return requestAsync(msg);
};

/**
 * 支付接口(输入密码进行支付)
 */
const walletPay = async (order: any,secretHash?:string) => {
    const signJson = {
        appid: order.appid,
        transaction_id: order.transaction_id,
        nonce_str: Math.random().toFixed(5)
    };
    let signStr;
    // tslint:disable-next-line:variable-name
    let no_password = SetNoPassword.SETED;  // 使用免密
    if (secretHash) {
        signStr = getSign(signJson, secretHash);
        no_password = SetNoPassword.NOSETED;
    }
    const msg = {
        type: 'wallet/order@pay',
        param: {
            ...signJson,
            sign: signStr,
            no_password
        }
    };

    console.log('walletPay =======',msg);

    return requestAsync(msg);
};

/**
 * 查询是否开启免密支付
 * @param appid 应用id
 * @param callback 回调函数
 */
// tslint:disable-next-line:variable-name
const queryNoPWD = async (appid:string,total_fee?:number) => {
    const msg = {
        type: 'wallet/order@nopwd_limit',
        param: { appid,total_fee }
    };

    let setNoPassword;
    try {
        await requestAsync(msg);
        setNoPassword = SetNoPassword.SETED;
    } catch (err) {
        if (err.result === 2119) {  // 用户未开启免密支付
            setNoPassword = SetNoPassword.NOSETED;
        } else if (err.result === 2118) { // 免密支付已达当日限额
            setNoPassword = SetNoPassword.EXCEEDLIMIT;
        } else {
            setNoPassword = SetNoPassword.NOSETED;
        }
    }
    
    return setNoPassword;
};

/**
 * 设置免密支付
 * @param appid appid
 * @param noPSW  0 关闭免密  1 开启免密
 * @param secretHash 密码hash
 */
const setNoPWD = async (appid:string,noPSW:number,secretHash:string) => {
    const signJson = {
        appid,
        no_password: noPSW,
        nonce_str: Math.random().toFixed(5)
    };
    const signStr = getSign(signJson, secretHash);
    const msg = {
        type: 'wallet/order@set_nopwd',
        param:{
            ...signJson,
            user_sign:signStr
        }
    };

    return requestAsync(msg);
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
    const mnemonic = getMnemonicByHash(secretHash);
    const wlt = GlobalWallet.createWltByMnemonic(mnemonic,'ETH',0);

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
