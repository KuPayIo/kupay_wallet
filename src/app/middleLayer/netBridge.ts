// tslint:disable-next-line:max-line-length
import { defaultLogin, getOpenId, getRandom, loginSuccess, loginWallet, logoutAccount, logoutAccountDel, logoutWallet, openConnect, requestAsync, requestAsyncNeedLogin, setKickOffline, setLoginWalletFailed, walletManualReconnect } from '../jsc/jscLogin';
import { fetchBtcFees, fetchGasPrices, getRealUser, getServerCloudBalance } from '../jsc/jscPull';

/**
 * login.ts 对应的 bridge layer
 */

 /**
  * 开启ws连接
  */
export const openWSConnect = (secrectHash:string = '') => {
    return new Promise(resolve => {
        openConnect(secrectHash);
        resolve();
    });
};

/**
 * 请求调用
 * @param msg 参数
 */
export const callRequestAsync = (msg: any) => {
    return requestAsync(msg);
};

/**
 * 通用的异步通信 需要登录
 * 
 * 需要登录权限的接口
 * emit_red_bag  发红包
 * to_cash       eth提现
 * btc_to_cash   btc提现
 * manage_money@buy    购买理财
 * manage_money@sell   出售理财
 */
export const callRequestAsyncNeedLogin = (msg: any,secretHash:string) => {
    return requestAsyncNeedLogin(msg,secretHash);
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

// 获取云端余额
export const callGetServerCloudBalance = () => {
    return getServerCloudBalance();
};

// 获取真实用户
export const callGetRealUser = () => {
    return getRealUser();
};
// 手动重连
export const callWalletManualReconnect = () => {
    return new Promise(resolve => {
        walletManualReconnect();
        resolve();
    });
};

/**
 * 注销账户保留数据
 */
export const callLogoutAccount = (noLogin?:boolean) => {
    return new Promise(resolve => {
        logoutAccount(noLogin);
        resolve();
    });
};

/**
 * 注销账户并删除数据
 */
export const callLogoutAccountDel = (noLogin?:boolean) => {
    return new Promise((resolve) => {
        logoutAccountDel(noLogin);
        resolve();
    });
};
/**
 * 登录某个账号成功
 */
export const callLoginSuccess = (account:any,secretHash:string) => {
    return new Promise(resolve => {
        loginSuccess(account,secretHash);
        resolve();
    });
};

/**
 * 获取gasPrice
 */
export const callFetchBtcFees = () => {
    return fetchBtcFees();
};

/**
 * 获取gasPrice
 */
export const callFetchGasPrices = () => {
    return fetchGasPrices();
};

/**
 * 授权用户openID接口
 * @param appId appId 
 */
export const callGetOpenId = (appId:string) => {
    return getOpenId(appId);
};