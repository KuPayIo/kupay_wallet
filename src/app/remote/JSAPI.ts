/**
 * 授权、支付等API
 */
import { goshare, ImageNameType } from '../../pi/browser/vm';
import { WebViewManager } from '../../pi/browser/webview';
import { SCPrecision } from '../publicLib/config';
import { CloudCurrencyType, ThirdCmd } from '../publicLib/interface';
import { getCloudBalances, getStore, setStore } from '../store/memstore';
import { getOpenId, requestAsync } from './login';
import { postThirdPushMessage } from './postWalletMessage';
import { getOneUserInfo } from './pull';
import { goRecharge } from './recharge';
import { addWebviewReloadListener } from './reload';
import { exportPrivateKeyByMnemonic, genmnemonicSign, getMnemonicByHash, VerifyIdentidy } from './wallet';

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
    getOpenId(payload.appId).then((resData) => {
        const ret:any = {};
        ret.openId = resData.openid;
        // if (payload.avatar) {
        //     ret.avatar = userInfo.avatar;
        // }
        // if (payload.nickName) {
        //     ret.nickName = userInfo.nickName;
        // }
        callback(undefined,ret);
    }).catch(err => {
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
    thirdPay1(payload.order,payload.webviewName).then(([err,res]) => {
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
const thirdPay1 = async (order:ThirdOrder,webviewName: string) => {
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
            // minWebview1(webviewName);
            const mchInfo = await getOneUserInfo([Number(order.mch_id)]);
            console.log(`商户信息 ========== mch_id = ${order.mch_id}  mchInfo = ${mchInfo}`);
            const [err,res] = await goRecharge(scBalance,fee_total);
            if (!err) {  // 充值成功   直接购买
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
                return [err,{ result:PayCode.RECHARGEFAILED }];
            }
            
        }
    } catch (err) {
        console.log('thirdPay err =====',err);

        return [err,{ result:PayCode.FAILED }];
    }
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
const orderPay = async (order: any,secretHash?:string) => {
    const signJson = {
        appid: order.appid,
        transaction_id: order.transaction_id,
        nonce_str: Math.random().toFixed(5)
    };
    let signStr;
    // tslint:disable-next-line:variable-name
    let no_password = SetNoPassword.SETED;  // 使用免密
    if (secretHash) {
        signStr = await getSign(signJson, secretHash);
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
    const signStr = await getSign(signJson, secretHash);
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
const getSign = async (json:any,secretHash:string) => {
    const mnemonic = await getMnemonicByHash(secretHash);
    const privateKey = await exportPrivateKeyByMnemonic(mnemonic);

    return genmnemonicSign(jsonUriSort(json), privateKey);
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

 /**
  * 关闭打开的webview
  */
export const closeWebview = (webviewName: string) => {
    console.log('wallet closeWebview called');
    WebViewManager.close(webviewName);
    openDefaultWebview();
};

/**
 * 最小化webview
 */
export const minWebview = (payload:{webviewName: string;popFloatBox:boolean}) => {
    console.log('wallet minWebview called');
    minWebview1(payload.webviewName);
    openDefaultWebview(() => {
        postThirdPushMessage(ThirdCmd.MIN,payload);
    });
};

/**
 * 最小化webview
 */
export const minWebview1 = (webviewName: string) => {
    console.log('wallet minWebview called');
    WebViewManager.minWebView(webviewName);
};

/**
 * 邀请好友
 */
export const inviteFriends = (payload:{webviewName: string;nickName:string;inviteCode:string;apkDownloadUrl:string}) => {
    console.log('wallet inviteFriends called',JSON.stringify(payload));
    // minWebview1(payload.webviewName);
    // TODO 此处判断default webview是否活跃
    // postThirdPushMessage(ThirdCmd.INVITE);
    goshare(ImageNameType.Wallet,payload.nickName,payload.inviteCode,payload.apkDownloadUrl,() => {
        console.log('分享成功');
    },() => {
        console.log('分享失败');
    });
};

/**
 * 去充值
 */
export const gotoRecharge = (webviewName: string) => {
    console.log('wallet gotoRecharge called');
    // minWebview1(webviewName);
    // TODO 如果需要最小化 充值成功后重新打开  需要把所需参数回传
    const scBalance = getCloudBalances().get(CloudCurrencyType.SC);
    goRecharge(scBalance,0);
};

/**
 * 游戏客服
 */
export const gotoGameService = (webviewName: string) => {
    console.log('wallet gotoGameService called');
    minWebview1(webviewName);
    openDefaultWebview(() => {
        postThirdPushMessage(ThirdCmd.GAMESERVICE,webviewName);
    });
    
};

/**
 * 官方群聊
 */
export const gotoOfficialGroupChat = (webviewName: string) => {
    console.log('wallet gotoOfficialGroupChat called');
    minWebview1(webviewName);
    openDefaultWebview(() => {
        postThirdPushMessage(ThirdCmd.OFFICIALGROUPCHAT,webviewName);
    });
};

/**
 * 打开默认webview
 * @param cb 成功回调
 */
const openDefaultWebview = (cb?:Function) => {
    WebViewManager.isDefaultKilled((killed:boolean) => {
        if (killed) {
            addWebviewReloadListener(() => {     // 通知已经登录成功
                setStore('user/isLogin',true);
                setStore('flags/doLoginSuccess',true);
            });
            addWebviewReloadListener(cb);
            WebViewManager.reloadDefault();
        } else {
            cb && cb();
        }
    });
};
