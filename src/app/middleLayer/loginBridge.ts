// tslint:disable-next-line:max-line-length
import { defaultLogin, getRandom, loginWallet, logoutAccountDel, logoutWallet, openConnect, setKickOffline, setLoginWalletFailed } from '../net/login';
import { requestAsync } from '../net/pull';

/**
 * login.ts 对应的 bridge layer
 */

 /**
  * 开启ws连接
  */
export const openWSConnect = (secrectHash:string = '') => {
    openConnect(secrectHash);
};

/**
 * 请求调用
 * @param msg 参数
 */
export const callRequestAsync = (msg: any) => {
    return requestAsync(msg);
};

/**
 * 获取随机数
 * flag:0 普通用户注册，1注册即为真实用户
 */
export const callGetRandom = (secretHash:string,cmd?:number,phone?:number,code?:number,num?:string) => {
    return new Promise((resolve) => {
        getRandom(secretHash,cmd,phone,code,num).then((res) => {
            resolve(res);
        });
    });
};
/**
 * 创建钱包后默认登录
 */
export const callDefaultLogin = (hash:string,conRandom:string) => {
    return new Promise((resolve) => {
        defaultLogin(hash,conRandom).then(() => {
            resolve();
        });
    });
};

/**
 * 登录钱包
 */
export const callLoginWallet = (appId:string,success:Function) => {
    return new Promise((resolve) => {
        loginWallet(appId,success);
        resolve();
    });
};

/**
 * 登出钱包
 */
export const callLogoutWallet = (success:Function) => {
    return new Promise((resolve) => {
        logoutWallet(success);
        resolve();
    });
};

/**
 * 注销账户并删除数据
 */
export const callLogoutAccountDel = () => {
    return new Promise((resolve) => {
        logoutAccountDel();
        resolve();
    });
};

// 设置登录失败回调
export const callSetLoginWalletFailed = (callback:Function) => {
    return new Promise((resolve) => {
        setLoginWalletFailed(callback);
        resolve();
    });
};

// 设置踢人下线回调
export const callSetKickOffline = (callback:Function) => {
    return new Promise((resolve) => {
        setKickOffline(callback);
        resolve();
    });
};