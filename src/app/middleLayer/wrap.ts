/**
 * 中间件
 */
import { LANGUAGE } from '../core/btc/wallet';
import { AddrInfo, CloudCurrencyType, CreateWalletOption, MinerFeeLevel, TxHistory, TxPayload } from '../publicLib/interface';

// ===========================================memstroe相关===================================================================
declare var pi_modules;
declare var pi_update;

const dev = true;    // 开发模式下 使用浏览器版本
let mod;             // 不同模式下引入的wrap模块
let sourceList = [];

if (dev || !pi_update.inApp) {   // 使用浏览器版本模式
    sourceList = ['app/middleLayer/wrap_browser'];
} else {
    sourceList = ['app/middleLayer/wrap_vm'];
}
pi_modules.commonjs.exports.require(sourceList, {},  (mods, tmpfm) => {
    mod = mods[0];
},(result) => {
    console.log('require faile =',sourceList);
}, () => {
    // console.log();
});

/**
 * 获取store数据
 */
export const getStoreData = (key:string, defaultValue = undefined):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.getStoreData(key,defaultValue);
};

/**
 * 更新store并通知
 */
export const setStoreData = (path: string, data: any, notified = true):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.setStoreData(path,data,notified);
};

/**
 * 获取所有的账户列表
 */
export const callGetAllAccount = ():Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callGetAllAccount();
};

/**
 * 获取云端余额
 */
export const callGetCloudBalances = ():Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callGetCloudBalances();
};

/**
 * 删除账户
 */
export const callDeleteAccount = (id: string):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callDeleteAccount(id);
};

// ===========================================memstroe相关===================================================================

// ===========================================tools相关===================================================================

/**
 * 删除本地交易记录
 */
export const callDeletLocalTx = (tx: TxHistory):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callDeletLocalTx(tx);
};

/**
 * 获取云端总资产
 */
export const callFetchCloudTotalAssets = ():Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callFetchCloudTotalAssets();
};

/**
 * 获取总资产
 */
export const callFetchLocalTotalAssets = ():Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callFetchLocalTotalAssets();
};
/**
 * 获取本地钱包资产列表
 */
export const callFetchWalletAssetList = ():Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callFetchWalletAssetList();
};

/**
 * 获取云端钱包资产列表
 */
export const callFetchCloudWalletAssetList = ():Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callFetchCloudWalletAssetList();
};

// 计算支持的币币兑换的币种
export const callCurrencyExchangeAvailable = ():Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callCurrencyExchangeAvailable();
};

/**
 * 获取某个币种对应的货币价值即汇率
 */
export const callFetchBalanceValueOfCoin = (currencyName: string | CloudCurrencyType, balance: number):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callFetchBalanceValueOfCoin(currencyName,balance);
};

// 获取货币的涨跌情况
export const callFetchCoinGain = (currencyName: string):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callFetchCoinGain(currencyName);
};

// ===========================================tools相关===================================================================

// ===========================================net相关===================================================================

/**
 * 开启ws连接
 */
export const openWSConnect = (secrectHash:string = ''):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.openWSConnect(secrectHash);
};

/**
 * 请求调用
 * @param msg 参数
 */
export const callRequestAsync = (msg: any):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callRequestAsync(msg);
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
export const callRequestAsyncNeedLogin = (msg: any,secretHash:string):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callRequestAsyncNeedLogin(msg,secretHash);
};

/**
 * 获取随机数
 * flag:0 普通用户注册，1注册即为真实用户
 */
export const callGetRandom = (secretHash:string,cmd?:number,phone?:number,code?:number,num?:string):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callGetRandom(secretHash,cmd,phone,code,num);
};
/**
 * 创建钱包后默认登录
 */
export const callDefaultLogin = (hash:string,conRandom:string):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callDefaultLogin(hash,conRandom);
};

// 获取云端余额
export const callGetServerCloudBalance = ():Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callGetServerCloudBalance();
};

// 获取真实用户
export const callGetRealUser = ():Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callGetRealUser();
};

// 手动重连
export const callWalletManualReconnect = ():Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callWalletManualReconnect();
};

/**
 * 注销账户保留数据
 */
export const callLogoutAccount = ():Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callLogoutAccount();
};

/**
 * 注销账户并删除数据
 */
export const callLogoutAccountDel = ():Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callLogoutAccountDel();
};
/**
 * 登录某个账号成功
 */
export const callLoginSuccess = (account:any,secretHash:string):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callLoginSuccess(account,secretHash);
};

/**
 * 获取gasPrice
 */
export const callFetchBtcFees = ():Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callFetchBtcFees();
};

/**
 * 获取gasPrice
 */
export const callFetchGasPrices = ():Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callFetchGasPrices();
};

/**
 * 授权用户openID接口
 * @param appId appId 
 */
export const callGetOpenId = (appId:string):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callGetOpenId(appId);
};

/**
 * 获取全部用户嗨豆排名列表
 */
export const callGetHighTop = (num: number):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callGetHighTop(num);
};

/**
 * 获取指定货币流水
 * filter（0表示不过滤，1表示过滤）
 */
export const callGetAccountDetail = (coin: string,filter:number,start = ''):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callGetAccountDetail(coin,filter,start);
};

/**
 * 充值历史记录
 */
export const callGetRechargeLogs = (coin: string,start?):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callGetRechargeLogs(coin,start);
};

/**
 * 提现历史记录
 */
export const callGetWithdrawLogs = (coin: string,start?):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callGetWithdrawLogs(coin,start);
};

/**
 * 购买理财
 */
export const callBuyProduct = (pid:any,count:any,secretHash:string):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callBuyProduct(pid,count,secretHash);
};

/**
 * 获取理财列表
 */
export const callGetProductList = ():Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callGetProductList();
};

/**
 * 理财购买记录
 */
export const callGetPurchaseRecord = (start = ''):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callGetPurchaseRecord(start);
};

/**
 * 查询发送红包记录
 */
export const callQuerySendRedEnvelopeRecord = (start?: string):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callQuerySendRedEnvelopeRecord(start);
};

/**
 * 查询某个红包兑换详情
 */
export const callQueryDetailLog = (uid:number,rid: string,accId?:string):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callQueryDetailLog(uid,rid,accId);
};

/**
 * 获取分红汇总信息
 */
export const callGetDividend = ():Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callGetDividend();
};

/**
 * 获取分红历史记录
 */
export const callGetDividHistory = (start = ''):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callGetDividHistory(start);
};

/**
 * 获取挖矿汇总信息
 */
export const callGetMining = ():Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callGetMining();
};

/**
 * 矿山增加记录
 */
export const callGetMineDetail = (start = ''):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callGetMineDetail(start);
};

/**
 * 查询红包兑换记录
 */
export const callQueryConvertLog = (start?:string):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callQueryConvertLog(start);
};

// ===========================================net相关===================================================================

// ===========================================wallet相关===================================================================

/**
 * 获取eth api url
 */
export const callGetEthApiBaseUrl = ():Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callGetEthApiBaseUrl();
};

/**
 * dataCenter更新余额
 */
export const callDcUpdateBalance = (addr: string, currencyName: string):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callDcUpdateBalance(addr,currencyName);
};

/**
 * dataCenter刷新本地钱包
 */
export const callDcRefreshAllTx = ():Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callDcRefreshAllTx();
};

/**
 * dataCenter初始化ERC20代币GasLimit
 */
export const callDcInitErc20GasLimit = ():Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callDcInitErc20GasLimit();
};

/**
 * dataCenter更新地址相关 交易记录及余额定时更新
 */
export const callDcUpdateAddrInfo = (addr: string, currencyName: string):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callDcUpdateAddrInfo(addr,currencyName);
};

/**
 * dataCenter通过hash清楚定时器
 */
export const callDcClearTxTimer = (hash: string):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callDcClearTxTimer(hash);
};
/**
 * 验证当前账户身份
 * @param passwd 密码
 */
export const callVerifyIdentidy = (passwd:string):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callVerifyIdentidy(passwd);
};

/**
 * 验证某个账户身份
 */
export const callVerifyIdentidy1 = (passwd:string,vault:string,salt:string):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callVerifyIdentidy1(passwd,vault,salt);
};

/**
 * 随机创建钱包
 */
export const callCreateWalletRandom = (option: CreateWalletOption,tourist?:boolean):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callCreateWalletRandom(option,tourist);
};

/**
 * 通过助记词导入钱包
 */
export const callImportWalletByMnemonic = (option: CreateWalletOption):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callImportWalletByMnemonic(option);
};

/**
 * 图片创建钱包
 */
export const callCreateWalletByImage = (option: CreateWalletOption):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callCreateWalletByImage(option);
};

/**
 * 冗余助记词导入
 */
export const callImportWalletByFragment = (option: CreateWalletOption):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callImportWalletByFragment(option);
};

/**
 * 创建新地址
 */
export const callCreateNewAddr = (passwd: string, currencyName: string):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callCreateNewAddr(passwd,currencyName);
};

/**
 * 备份助记词
 * @param passwd 密码 
 */
export const callBackupMnemonic = (passwd:string,needFragments:boolean = true):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callBackupMnemonic(passwd,needFragments);
};

/**
 * 修改密码
 */
export const callPasswordChange = (secretHash: string, newPsw: string):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callPasswordChange(secretHash,newPsw);
};

/**
 * 获取矿工费
 */
export const callFetchMinerFeeList = (currencyName:string):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callFetchMinerFeeList(currencyName);
};

// 获取gasPrice
export const callFetchGasPrice = (minerFeeLevel: MinerFeeLevel):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callFetchGasPrice(minerFeeLevel);
};

/**
 * 获取某个地址的交易记录
 */
export const callFetchTransactionList = (addr:string,currencyName:string):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callFetchTransactionList(addr,currencyName);
};

// 根据hash获取助记词
export const callGetMnemonicByHash = (hash:string):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callGetMnemonicByHash(hash);
};

/**
 * 增加或者删除展示的币种
 */
export const callUpdateShowCurrencys = (currencyName:string,added:boolean):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callUpdateShowCurrencys(currencyName,added);
};

/**
 * 获取当前钱包对应货币正在使用的地址信息
 * @param currencyName 货币类型
 */
export const callGetCurrentAddrInfo = (currencyName: string):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callGetCurrentAddrInfo(currencyName);
};

/**
 * 获取钱包下指定货币类型的所有地址信息
 * @param wallet wallet obj
 */
export const callGetAddrsInfoByCurrencyName = (currencyName: string):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callGetAddrsInfoByCurrencyName(currencyName);
};

/**
 * 普通转账
 */
export const callTransfer = (psw:string,txPayload:TxPayload):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callTransfer(psw,txPayload);
};

/**
 * 更新本地交易记录
 */
export const callUpdateLocalTx = (tx: TxHistory):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callUpdateLocalTx(tx);
};

/**
 * 判断助记词是否合法
 */
export const callisValidMnemonic = (language: LANGUAGE, mnemonic: string):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callisValidMnemonic(language,mnemonic);
};

// 导出以太坊私钥
export const callExportETHPrivateKey = (mnemonic:string,addrs: AddrInfo[]):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callExportETHPrivateKey(mnemonic,addrs);
};

 // 导出BTC私钥
export const callExportBTCPrivateKey = (mnemonic:string,addrs: AddrInfo[]):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callExportBTCPrivateKey(mnemonic,addrs);
};

// 导出ERC20私钥
export const callExportERC20TokenPrivateKey = (mnemonic:string,addrs: AddrInfo[],currencyName:string):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callExportERC20TokenPrivateKey(mnemonic,addrs,currencyName);
};

/**
 * btc充值
 */
export const callBtcRecharge = (psw:string,txRecord:TxHistory):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callBtcRecharge(psw,txRecord);
};

/**
 * eth充值
 */
export const callEthRecharge = (psw:string,txRecord:TxHistory):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callEthRecharge(psw,txRecord);
};

/**
 * btc重发充值
 */
export const callResendBtcRecharge = (psw:string,txRecord:TxHistory):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callResendBtcRecharge(psw,txRecord);
};

// eth提现
export const callEthWithdraw = (secretHash:string,toAddr:string,amount:number | string):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callEthWithdraw(secretHash,toAddr,amount);
};

// btc提现
export const callBtcWithdraw = (secretHash:string,toAddr:string,amount:number | string):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callBtcWithdraw(secretHash,toAddr,amount);
};

/**
 * 获取钱包地址的位置
 */
export const callGetWltAddrIndex = (addr: string, currencyName: string):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callGetWltAddrIndex(addr,currencyName);
};

/**
 * 处理ETH转账
 */
export const callDoEthTransfer = (psw:string,addrIndex:number,txRecord:TxHistory):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callDoEthTransfer(psw,addrIndex,txRecord);
};

/**
 * btc重发
 */
export const callResendBtcTransfer = (psw:string,addrIndex:number,txRecord:TxHistory):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callResendBtcTransfer(psw,addrIndex,txRecord);
};

/**
 * 处理eth代币转账
 */
export const callDoERC20TokenTransfer = (psw:string,addrIndex:number, txRecord:TxHistory):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callDoERC20TokenTransfer(psw,addrIndex,txRecord);
};

/**
 * ahash to argonhash
 * @param imagePsw 图片密码
 * @param ahash ahash
 */
export const callAhashToArgon2Hash = (ahash: string, imagePsw: string):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callAhashToArgon2Hash(ahash,imagePsw);
};

// 锁屏密码hash算法
export const callLockScreenHash = (psw:string):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callLockScreenHash(psw);
};

// 锁屏密码验证
export const callLockScreenVerify = (psw:string):Promise<any> => {
    if (!mod) return Promise.reject('mod is undefined');

    return mod.callLockScreenVerify(psw);
};

// ===========================================wallet相关===================================================================