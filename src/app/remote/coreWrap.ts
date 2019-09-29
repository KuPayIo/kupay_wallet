/**
 * 对rpc调用函数的封装  在所有的函数后面加上callback 所有函数返回值都为undefiend
 */
import { CloudCurrencyType, TxHistory } from '../publicLib/interface';
import { deleteAccount, getAllAccount, getCloudBalances1, getStore, setStore } from '../store/memstore';
import { getHomePageEnterData } from '../store/vmRegister';
// tslint:disable-next-line:max-line-length
import { getOpenId, loginSuccess, logoutAccount, openConnect, requestAsync, requestAsyncNeedLogin, touristLogin, walletManualReconnect } from './login';
// tslint:disable-next-line:max-line-length
import { buyProduct, fetchBtcFees, fetchGasPrices, getAccountDetail, getDividend, getDividHistory, getFriendsKTTops, getHighTop, getInviteCode, getMineDetail, getMining, getOneUserInfo, getProductList, getPurchaseRecord, getRechargeLogs, getServerCloudBalance, getWithdrawLogs, queryConvertLog, queryDetailLog, querySendRedEnvelopeRecord } from './pull';
import { goRecharge } from './recharge';
import { emitWebviewReload } from './reload';
// tslint:disable-next-line:max-line-length
import { currencyExchangeAvailable, fetchBalanceValueOfCoin, fetchCloudTotalAssets, fetchCloudWalletAssetList, fetchCoinGain, fetchLocalTotalAssets, fetchWalletAssetList,getAddrsInfoByCurrencyName, getCurrentAddrInfo, updateLocalTx } from './tools';
import { lockScreenHash, lockScreenVerify, passwordChange, VerifyIdentidy, VerifyIdentidy1 } from './wallet';

/**
 * 对所有的错误进行处理  rpc调用会对结果JOSN.stringify,如果是Error对象,stringify后为"{}"
 */
export const handleError = (err:any) => {
    if (err instanceof Error) return { message:err.message };

    return err;
};

// ===========================================memstroe相关===================================================================

/**
 * 获取store数据
 */
export const getStoreData = (key:string, defaultValue = undefined,callback:Function) => {
    callback([undefined,getStore(key,defaultValue)]);
};

/**
 * 更新store并通知
 */
export const setStoreData = (path: string, data: any, notified = true,callback:Function) => {
    callback([undefined,setStore(path,data,notified)]);
};

/**
 * 获取所有的账户列表
 */
export const callGetAllAccount = (callback:Function) => {
    getAllAccount().then(res => {
        callback([undefined,res]);
    }).catch(err => {
        callback([err]);
    });
};

/**
 * 获取云端余额
 */
export const callGetCloudBalances = (callback:Function) => {
    callback([undefined,getCloudBalances1()]);
};

/**
 * 获取云端钱包
 */
export const callGetCloudWallets = (callback:Function) => {
    callback([undefined,[...getStore('cloud/cloudWallets')]]);
};

/**
 * 删除账户
 */
export const callDeleteAccount = (id: string,callback:Function) => {
    deleteAccount(id).then(res => {
        callback([undefined,res]);
    }).catch(err => {
        callback([err]);
    });
};

/**
 * 获取首页登录所需数据
 */
export const callGetHomePageEnterData = (callback:Function) => {
    getHomePageEnterData().then(res => {
        callback([undefined,res]);
    }).catch(err => {
        callback([err]);
    });
};

// ===========================================memstroe相关===================================================================

// ===========================================tools相关===================================================================

/**
 * 获取云端总资产
 */
export const callFetchCloudTotalAssets = (callback:Function) => {
    callback([undefined,fetchCloudTotalAssets()]);
};

/**
 * 获取总资产
 */
export const callFetchLocalTotalAssets = (callback:Function) => {
    callback([undefined,fetchLocalTotalAssets()]);
};
/**
 * 获取本地钱包资产列表
 */
export const callFetchWalletAssetList = (callback:Function) => {
    callback([undefined,fetchWalletAssetList()]);
};

/**
 * 获取云端钱包资产列表
 */
export const callFetchCloudWalletAssetList = (callback:Function) => {
    callback([undefined,fetchCloudWalletAssetList()]);
};

// 计算支持的币币兑换的币种
export const callCurrencyExchangeAvailable = (callback:Function) => {
    callback([undefined,currencyExchangeAvailable()]);
};

/**
 * 获取某个币种对应的货币价值即汇率
 */
export const callFetchBalanceValueOfCoin = (currencyName: string | CloudCurrencyType, balance: number,callback:Function) => {
    callback([undefined,fetchBalanceValueOfCoin(currencyName,balance)]);
};

// 获取货币的涨跌情况
export const callFetchCoinGain = (currencyName: string,callback:Function) => {
    callback([undefined,fetchCoinGain(currencyName)]);
};

/**
 * 获取钱包下指定货币类型的所有地址信息
 * @param wallet wallet obj
 */
export const callGetAddrsInfoByCurrencyName = (currencyName: string,callback:Function) => {
    callback([undefined,getAddrsInfoByCurrencyName(currencyName)]);
};

/**
 * 获取当前钱包对应货币正在使用的地址信息
 * @param currencyName 货币类型
 */
export const callGetCurrentAddrInfo = (currencyName: string,callback:Function) => {
    callback([undefined,getCurrentAddrInfo(currencyName)]);
};

/**
 * 更新本地交易记录
 */
export const callUpdateLocalTx = (tx: TxHistory,callback:Function) => {
    callback([undefined,updateLocalTx(tx)]);
};

// ===========================================tools相关===================================================================

// ===========================================net相关===================================================================

/**
 * 开启ws连接
 */
export const openWSConnect = (secrectHash:string = '',callback:Function) => {
    callback([undefined,openConnect(secrectHash)]);
};

/**
 * 请求调用
 * @param msg 参数
 */
export const callRequestAsync = (msg: any,callback:Function) => {
    requestAsync(msg).then(res => {
        callback([undefined,res]);
    }).catch(err => {
        callback([err]);
    });
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
export const callRequestAsyncNeedLogin = (msg: any,secretHash:string,callback:Function) => {
    requestAsyncNeedLogin(msg,secretHash).then(res => {
        callback([undefined,res]);
    }).catch(err => {
        callback([err]);
    });
};

// 获取云端余额
export const callGetServerCloudBalance = (callback:Function) => {
    getServerCloudBalance().then(res => {
        callback([undefined,res]);
    }).catch(err => {
        callback([err]);
    });
};

// 手动重连
export const callWalletManualReconnect = (callback:Function) => {
    callback([undefined,walletManualReconnect()]);
};

/**
 * 注销账户
 */
export const callLogoutAccount = (save:boolean = true,callback:Function) => {
    logoutAccount(save).then(res => {
        callback([undefined,res]);
    }).catch(err => {
        callback([err]);
    });
};

/**
 * 登录某个账号成功
 */
export const callLoginSuccess = (account:any,secretHash:string,callback:Function) => {
    callback([undefined,loginSuccess(account,secretHash)]);
};

/**
 * 获取gasPrice
 */
export const callFetchBtcFees = (callback:Function) => {
    fetchBtcFees().then(res => {
        callback([undefined,res]);
    }).catch(err => {
        callback([err]);
    });
};

/**
 * 获取gasPrice
 */
export const callFetchGasPrices = (callback:Function) => {
    fetchGasPrices().then(res => {
        callback([undefined,res]);
    }).catch(err => {
        callback([err]);
    });
};

/**
 * 授权用户openID接口
 * @param appId appId 
 */
export const callGetOpenId = (appId:string,callback:Function) => {
    getOpenId(appId).then(res => {
        callback([undefined,res]);
    }).catch(err => {
        callback([err]);
    });
};

/**
 * 获取全部用户嗨豆排名列表
 */
export const callGetHighTop = (num: number,callback:Function) => {
    getHighTop(num).then(res => {
        callback([undefined,res]);
    }).catch(err => {
        callback([err]);
    });
};

/**
 * 获取指定货币流水
 * filter（0表示不过滤，1表示过滤）
 */
export const callGetAccountDetail = (coin: string,filter:number,start = '',callback:Function) => {
    getAccountDetail(coin,filter,start).then(res => {
        callback([undefined,res]);
    }).catch(err => {
        callback([err]);
    });
};

/**
 * 充值历史记录
 */
export const callGetRechargeLogs = (coin: string,start = '',callback:Function) => {
    getRechargeLogs(coin,start).then(res => {
        callback([undefined,res]);
    }).catch(err => {
        callback([err]);
    });
};

/**
 * 提现历史记录
 */
export const callGetWithdrawLogs = (coin: string,start = '',callback:Function) => {
    getWithdrawLogs(coin,start).then(res => {
        callback([undefined,res]);
    }).catch(err => {
        callback([err]);
    });
};

/**
 * 购买理财
 */
export const callBuyProduct = (pid:any,count:any,secretHash:string,callback:Function) => {
    buyProduct(pid,count,secretHash).then(res => {
        callback([undefined,res]);
    }).catch(err => {
        callback([err]);
    });
};

/**
 * 获取理财列表
 */
export const callGetProductList = (callback:Function) => {
    getProductList().then(res => {
        callback([undefined,res]);
    }).catch(err => {
        callback([err]);
    });
};

/**
 * 理财购买记录
 */
export const callGetPurchaseRecord = (start = '',callback:Function) => {
    getPurchaseRecord(start).then(res => {
        callback([undefined,res]);
    }).catch(err => {
        callback([err]);
    });
};

/**
 * 查询发送红包记录
 */
export const callQuerySendRedEnvelopeRecord = (start: string = '',callback:Function) => {
    querySendRedEnvelopeRecord(start).then(res => {
        callback([undefined,res]);
    }).catch(err => {
        callback([err]);
    });
};

/**
 * 查询某个红包兑换详情
 */
export const callQueryDetailLog = (uid:number,rid: string,accId:string = '',callback:Function) => {
    queryDetailLog(uid,rid,accId).then(res => {
        callback([undefined,res]);
    }).catch(err => {
        callback([err]);
    });
};

/**
 * 获取分红汇总信息
 */
export const callGetDividend = (callback:Function) => {
    getDividend().then(res => {
        callback([undefined,res]);
    }).catch(err => {
        callback([err]);
    });
};

/**
 * 获取分红历史记录
 */
export const callGetDividHistory = (start = '',callback:Function) => {
    getDividHistory(start).then(res => {
        callback([undefined,res]);
    }).catch(err => {
        callback([err]);
    });
};

/**
 * 获取挖矿汇总信息
 */
export const callGetMining = (callback:Function) => {
    getMining().then(res => {
        callback([undefined,res]);
    }).catch(err => {
        callback([err]);
    });
};

/**
 * 矿山增加记录
 */
export const callGetMineDetail = (start = '',callback:Function) => {
    getMineDetail(start).then(res => {
        callback([undefined,res]);
    }).catch(err => {
        callback([err]);
    });
};

/**
 * 查询红包兑换记录
 */
export const callQueryConvertLog = (start:string = '',callback:Function) => {
    queryConvertLog(start).then(res => {
        callback([undefined,res]);
    }).catch(err => {
        callback([err]);
    });
};

/**
 * 获取单个用户信息
 */
export const callGetOneUserInfo = (uids: number[], isOpenid: number = 0,callback:Function) => {
    getOneUserInfo(uids,isOpenid).then(res => {
        callback([undefined,res]);
    }).catch(err => {
        callback([err]);
    });
};

/**
 * 获取邀请码
 */
export const callGetInviteCode = (callback:Function) => {
    getInviteCode().then(res => {
        callback([undefined,res]);
    }).catch(err => {
        callback([err]);
    });
};

// 获取好友嗨豆排名
export const callGetFriendsKTTops = (arr:any,callback:Function) => {
    getFriendsKTTops(arr).then(res => {
        callback([undefined,res]);
    }).catch(err => {
        callback([err]);
    });
};
// ===========================================net相关===================================================================

// ===========================================wallet相关===================================================================

/**
 * 验证当前账户身份
 * @param passwd 密码
 */
export const callVerifyIdentidy = (passwd:string,callback:Function) => {
    VerifyIdentidy(passwd).then(res => {
        callback([undefined,res]);
    }).catch(err => {
        callback([handleError(err)]);
    });
};

/**
 * 验证某个账户身份
 */
export const callVerifyIdentidy1 = (passwd:string,vault:string,salt:string,callback:Function) => {
    VerifyIdentidy1(passwd,vault,salt).then(res => {
        callback([undefined,res]);
    }).catch(err => {
        callback([handleError(err)]);
    });
};

/**
 * 修改密码
 */
export const callPasswordChange = (secretHash: string, newPsw: string,callback:Function) => {
    passwordChange(secretHash,newPsw).then(res => {
        callback([undefined,res]);
    }).catch(err => {
        callback([handleError(err)]);
    });
};

// 锁屏密码hash算法
export const callLockScreenHash = (psw:string,callback:Function) => {
    lockScreenHash(psw).then(res => {
        callback([undefined,res]);
    }).catch(err => {
        callback([handleError(err)]);
    });
};

// 锁屏密码验证
export const callLockScreenVerify = (psw:string,callback:Function) => {
    lockScreenVerify(psw).then(res => {
        callback([undefined,res]);
    }).catch(err => {
        callback([handleError(err)]);
    });
};

// ===========================================wallet相关===================================================================

// ==================================recharge相关=========================================

/**
 * 去充值页面
 */
export const callGoRecharge = (balance:number,muchNeed:number,callback:Function) => {
    goRecharge(balance,muchNeed).then(res => {
        callback([undefined,res]);
    }).catch(err => {
        callback([handleError(err)]);
    });
};

// ==================================recharge相关=========================================

// ==================================reload相关=========================================

/**
 * reload success
 */
export const callEmitWebviewReload = (callback:Function) => {
    callback([undefined,emitWebviewReload()]);
};

// ==================================reload相关=========================================

/**
 * 新版游客登录
 */
export const callManualLogin = (callback:Function) => {
    touristLogin().then(res => {
        callback([undefined,res]);
    }).catch(err => {
        callback([handleError(err)]);
    });
};