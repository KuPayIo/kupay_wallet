// tslint:disable-next-line:max-line-length
import { defaultLogin, getOpenId, getRandom, loginSuccess, logoutAccount, logoutAccountDel, openConnect, requestAsync, requestAsyncNeedLogin, walletManualReconnect } from '../remote/login';
// tslint:disable-next-line:max-line-length
import { buyProduct, fetchBtcFees, fetchGasPrices, getAccountDetail, getDividend, getDividHistory, getHighTop, getMineDetail, getMining, getProductList, getPurchaseRecord, getRealUser, getRechargeLogs, getServerCloudBalance, getWithdrawLogs, queryConvertLog, queryDetailLog, querySendRedEnvelopeRecord } from '../remote/pull';

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

/**
 * 获取全部用户嗨豆排名列表
 */
export const callGetHighTop = (num: number) => {
    return getHighTop(num);
};

/**
 * 获取指定货币流水
 * filter（0表示不过滤，1表示过滤）
 */
export const callGetAccountDetail = (coin: string,filter:number,start = '') => {
    return getAccountDetail(coin,filter,start);
};

/**
 * 充值历史记录
 */
export const callGetRechargeLogs = (coin: string,start?) => {
    return getRechargeLogs(coin,start);
};

/**
 * 提现历史记录
 */
export const callGetWithdrawLogs = (coin: string,start?) => {
    return getWithdrawLogs(coin,start);
};

/**
 * 购买理财
 */
export const callBuyProduct = (pid:any,count:any,secretHash:string) => {
    return buyProduct(pid,count,secretHash);
};

/**
 * 获取理财列表
 */
export const callGetProductList = () => {
    return getProductList();
};

/**
 * 理财购买记录
 */
export const callGetPurchaseRecord = (start = '') => {
    return getPurchaseRecord(start);
};

/**
 * 查询发送红包记录
 */
export const callQuerySendRedEnvelopeRecord = (start?: string) => {
    return querySendRedEnvelopeRecord(start);
};

/**
 * 查询某个红包兑换详情
 */
export const callQueryDetailLog = (uid:number,rid: string,accId?:string) => {
    return queryDetailLog(uid,rid,accId);
};

/**
 * 获取分红汇总信息
 */
export const callGetDividend = () => {
    return getDividend();
};

/**
 * 获取分红历史记录
 */
export const callGetDividHistory = (start = '') => {
    return getDividHistory(start);
};

/**
 * 获取挖矿汇总信息
 */
export const callGetMining = () => {
    return getMining();
};

/**
 * 矿山增加记录
 */
export const callGetMineDetail = (start = '') => {
    return getMineDetail();
};

/**
 * 查询红包兑换记录
 */
export const callQueryConvertLog = (start?:string) => {
    return queryConvertLog(start);
};