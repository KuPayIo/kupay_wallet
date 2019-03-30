/**
 * 授权、支付等API
 */
import { WebViewManager } from '../../pi/browser/webview';
import { popNew } from '../../pi/ui/root';
import { sign } from '../core/genmnemonic';
import { GlobalWallet } from '../core/globalWallet';
import { getOneUserInfo, requestAsync } from '../net/pull';
import { CloudCurrencyType } from '../store/interface';
import { getCloudBalances } from '../store/memstore';
import { SCPrecision } from '../utils/constants';
import { getUserInfo } from '../utils/tools';
import { getMnemonicByHash, VerifyIdentidy } from '../utils/walletTools';
import { getGameItem } from '../view/play/home/gameConfig';
import { minWebview1 } from './thirdBase';

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
    console.log('querySetNoPassword called');
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
 * 第三方支付
 * @param order 订单
 * @param callback 回调
 */
export const thirdPay = (payload,callback) => {
    thirdPay1(payload.order,payload.webViewName).then(([err,res]) => {
        callback(err,res);
    });
};

/**
 * 第三方直接支付  已经免密验证过
 * @param payload 参数
 * @param callback 回调
 */
export const thirdPayDirect = (payload,callback) => {
    console.log('thirdPayDirect payload=====',payload);
    VerifyIdentidy(payload.password).then(secretHash => {
        if (!secretHash) {
            callback(undefined,{ result:PayCode.ERRORPSW });
            
            return;
        }
        walletPay(payload.order,secretHash).then(() => {
            callback(undefined,{ result:PayCode.SUCCESS });
        }).catch(err => {
            callback(undefined,{ result:PayCode.FAILED });
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
    total_fee:number;   // 支付金额
    mch_id:string;    // 商户id
}

/**
 * 支付返回结果
 */
const enum PayCode {
    SUCCESS = 1,     // 支付成功
    SETNOPASSWORD = 2,   // 余额足够  但是没有开启免密 
    EXCEEDLIMIT = 3, // 余额足够 并且开启免密 但是免密上限
    ERRORPSW = 4,    // 密码错误
    RECHARGEFAILED = 5,  // 充值失败
    FAILED = 6     // 支付失败
}
/**
 * 第三方支付
 */
const thirdPay1 = async (order:ThirdOrder,webViewName: string) => {
    try {
        // tslint:disable-next-line:variable-name
        const fee_total = order.total_fee;
        const setNoPassword = await queryNoPWD(order.appid,fee_total);
        const scBalance = getCloudBalances().get(CloudCurrencyType.SC);
        console.log('thirdPay balance =========',scBalance * SCPrecision);
        console.log('thirdPay fee_total =========',fee_total);
        console.log('thirdPay setNoPassword =========',setNoPassword);
        if (scBalance * SCPrecision >= fee_total) {
            if (setNoPassword === SetNoPassword.SETED) {// 余额足够并且免密开启   直接购买
                console.log('walletPay start------',order);
                const payRes = await walletPay(order);
                console.log('walletPay success',payRes);
    
                return [undefined,{ result:PayCode.SUCCESS }];
            } else if (setNoPassword === SetNoPassword.NOSETED) { // 余额足够  但是没有开启免密
                return [undefined,{ result:PayCode.SETNOPASSWORD }]; 
            } else {// 余额足够 并且开启免密 但是免密上限
                return [undefined,{ result:PayCode.EXCEEDLIMIT }]; 
            }
        } else { // 余额不够
            // TODO 跳转充值页面
            minWebview1(webViewName);
            const mchInfo = await getOneUserInfo([Number(order.mch_id)]);
            console.log('商户信息 ==========',mchInfo);
            const rechargeSuccess = await gotoRecharge(order,mchInfo && mchInfo.nickName,() => {
                WebViewManager.open(webViewName, `${getGameItem(webViewName).url}?${Math.random()}`, webViewName,'');
            });
            if (rechargeSuccess) {  // 充值成功   直接购买
                if (setNoPassword === SetNoPassword.SETED) {// 余额足够并且免密开启   直接购买
                    console.log('walletPay start------',order);
                    const payRes = await walletPay(order);
                    console.log('walletPay success',payRes);
            
                    return [undefined,{ result:PayCode.SUCCESS }];
                } else if (setNoPassword === SetNoPassword.NOSETED) { // 余额足够  但是没有开启免密
                    return [undefined,{ result:PayCode.SETNOPASSWORD }]; 
                } else {// 余额足够 并且开启免密 但是免密上限
                    return [undefined,{ result:PayCode.EXCEEDLIMIT }]; 
                }
            } else {
                return [undefined,{ result:PayCode.RECHARGEFAILED }];
            }
        }
    } catch (err) {
        console.log('thirdPay err =====',err);

        return [err,{ result:PayCode.FAILED }];
    }
};

/**
 * 跳转充值页面
 */
const gotoRecharge = (order:ThirdOrder,beneficiary:string = '未知',okCB:Function) => {
    return new Promise(resolve => {
        popNew('app-view-wallet-cloudWalletSC-thirdRechargeSC',{ order,beneficiary },(rechargeSuccess:boolean) => {
            resolve(rechargeSuccess);
        });
    });
};

/**
 * 启动支付接口(验证订单，展示订单信息) 预支付
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
const orderPay = (order: any,secretHash?:string) => {
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
    const param:any = {
        ...signJson,
        no_password
    };
    if (secretHash) {
        param.sign = signStr;
    }
    const msg = {
        type: 'wallet/order@pay',
        param
    };
    
    console.log('walletPay param-------------',msg);
    
    return requestAsync(msg);
};

/**
 * 预支付成功后支付
 */
const walletPay = async (order: any,secretHash?:string) => {
    console.log('openPayment start---------',order);
    const resData = await openPayment(order);
    console.log('openPayment resData---------',resData);
    await orderPay(order,secretHash);

    return resData;
};

/**
 * 查询是否开启免密支付
 * @param appid 应用id
 * @param callback 回调函数
 */
// tslint:disable-next-line:variable-name
const queryNoPWD = async (appid:string,total_fee?:number) => {
    const param:any = { appid };
    if (total_fee) {
        param.total_fee = total_fee;
    }
    const msg = {
        type: 'wallet/order@nopwd_limit',
        param
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
