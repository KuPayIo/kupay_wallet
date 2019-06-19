/**
 * 中间件
 */
import { WebViewManager } from '../../pi/browser/webview';
import { LANGUAGE } from '../core/btc/wallet';
import { getEthApiBaseUrl } from '../core/config';
import { isValidMnemonic } from '../core/genmnemonic';
import { AddrInfo, CloudCurrencyType, CreateWalletOption, MinerFeeLevel, TxHistory, TxPayload } from '../publicLib/interface';
import { dcClearTxTimer, dcInitErc20GasLimit, dcRefreshAllTx, dcUpdateAddrInfo, dcUpdateBalance } from '../remote/dataCenter';
// tslint:disable-next-line:max-line-length
import { getRandom, loginSuccess, logoutAccount, logoutAccountDel, openConnect, requestAsync, requestAsyncNeedLogin, walletManualReconnect } from '../remote/login';
// tslint:disable-next-line:max-line-length
import { buyProduct, fetchBtcFees, fetchGasPrices, getAccountDetail, getDividend, getDividHistory, getHighTop, getMineDetail, getMining, getProductList, getPurchaseRecord, getRealUser, getRechargeLogs, getServerCloudBalance, getWithdrawLogs, queryConvertLog, queryDetailLog, querySendRedEnvelopeRecord } from '../remote/pull';
// tslint:disable-next-line:max-line-length
import { btcRecharge, btcWithdraw, doERC20TokenTransfer, doEthTransfer, ethRecharge, ethWithdraw, resendBtcRecharge, resendBtcTransfer, transfer } from '../remote/pullWallet';
// tslint:disable-next-line:max-line-length
import { ahashToArgon2Hash, backupMnemonic, createNewAddr, createWalletByImage, createWalletRandom, exportBTCPrivateKey, exportERC20TokenPrivateKey, exportETHPrivateKey, fetchGasPrice, fetchMinerFeeList, fetchTransactionList, getMnemonicByHash, getWltAddrIndex, importWalletByFragment, importWalletByMnemonic, lockScreenHash, lockScreenVerify, passwordChange, updateShowCurrencys, VerifyIdentidy, VerifyIdentidy1 } from '../remote/wallet';

const vmName = 'JSVM';   // 虚拟机rpc通信名称

/**
 * vm rpc 调用
 * @param data 参数 
 */
const vmRpcCall = (moduleName:string,methodName:string,params: any[]):Promise<any> => {
    return new Promise((resolve) => {
        WebViewManager.rpc(vmName,{ moduleName,methodName,params },(res) => {
            resolve(res);
        });
    });
};

const MEMSTOREMODULENAME = 'app/store/memstore';   // memstore moduleName
const TOOLSMODULENAME = 'app/remote/tools';        // tools moduleName
const LOGINMODULENAME = 'app/remote/login';        // login moduleName
const PULLMODULENAME = 'app/remote/pull';          // pull moduleName

// ===========================================memstroe相关===================================================================

/**
 * 获取store数据
 */
export const getStoreData = (key:string, defaultValue = undefined) => {
    return vmRpcCall(MEMSTOREMODULENAME,'getStore',[key,defaultValue]);
};

/**
 * 更新store并通知
 */
export const setStoreData = (path: string, data: any, notified = true) => {
    return vmRpcCall(MEMSTOREMODULENAME,'setStore',[path,data,notified]);
};

/**
 * 获取所有的账户列表
 */
export const callGetAllAccount = () => {
    return vmRpcCall(MEMSTOREMODULENAME,'getAllAccount',[]);
};

/**
 * 获取云端余额
 */
export const callGetCloudBalances = () => {
    return vmRpcCall(MEMSTOREMODULENAME,'getCloudBalances',[]);
};

/**
 * 删除账户
 */
export const callDeleteAccount = (id: string) => {
    return vmRpcCall(MEMSTOREMODULENAME,'deleteAccount',[id]);
};

// ===========================================memstroe相关===================================================================

// ===========================================tools相关===================================================================

/**
 * 删除本地交易记录
 */
export const callDeletLocalTx = (tx: TxHistory) => {
    return vmRpcCall(TOOLSMODULENAME,'deletLocalTx',[tx]);
};

/**
 * 获取云端总资产
 */
export const callFetchCloudTotalAssets = () => {
    return vmRpcCall(TOOLSMODULENAME,'fetchCloudTotalAssets',[]);
};

/**
 * 获取总资产
 */
export const callFetchLocalTotalAssets = () => {
    return vmRpcCall(TOOLSMODULENAME,'fetchLocalTotalAssets',[]);
};
/**
 * 获取本地钱包资产列表
 */
export const callFetchWalletAssetList = () => {
    return vmRpcCall(TOOLSMODULENAME,'fetchWalletAssetList',[]);
};

/**
 * 获取云端钱包资产列表
 */
export const callFetchCloudWalletAssetList = () => {
    return vmRpcCall(TOOLSMODULENAME,'fetchCloudWalletAssetList',[]);
};

// 计算支持的币币兑换的币种
export const callCurrencyExchangeAvailable = () => {
    return vmRpcCall(TOOLSMODULENAME,'currencyExchangeAvailable',[]);
};

/**
 * 获取某个币种对应的货币价值即汇率
 */
export const callFetchBalanceValueOfCoin = (currencyName: string | CloudCurrencyType, balance: number) => {
    return vmRpcCall(TOOLSMODULENAME,'fetchBalanceValueOfCoin',[currencyName,balance]);
};

// 获取货币的涨跌情况
export const callFetchCoinGain = (currencyName: string) => {
    return vmRpcCall(TOOLSMODULENAME,'fetchCoinGain',[currencyName]);
};

/**
 * 获取钱包下指定货币类型的所有地址信息
 * @param wallet wallet obj
 */
export const callGetAddrsInfoByCurrencyName = (currencyName: string) => {
    return vmRpcCall(TOOLSMODULENAME,'getAddrsInfoByCurrencyName',[currencyName]);
};

/**
 * 获取当前钱包对应货币正在使用的地址信息
 * @param currencyName 货币类型
 */
export const callGetCurrentAddrInfo = (currencyName: string) => {
    return vmRpcCall(TOOLSMODULENAME,'getCurrentAddrInfo',[currencyName]);
};

/**
 * 更新本地交易记录
 */
export const callUpdateLocalTx = (tx: TxHistory) => {
    return vmRpcCall(TOOLSMODULENAME,'updateLocalTx',[tx]);
};

// ===========================================tools相关===================================================================

// ===========================================net相关===================================================================

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
    return vmRpcCall(LOGINMODULENAME,'defaultLogin',[hash,conRandom]);
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
export const callLogoutAccount = () => {
    return new Promise(resolve => {
        logoutAccount();
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
    return vmRpcCall(LOGINMODULENAME,'getOpenId',[appId]);
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
    return getMineDetail(start);
};

/**
 * 查询红包兑换记录
 */
export const callQueryConvertLog = (start?:string) => {
    return queryConvertLog(start);
};

// ===========================================net相关===================================================================

// ===========================================wallet相关===================================================================

/**
 * 获取eth api url
 */
export const callGetEthApiBaseUrl = () => {
    return new Promise((resolve) => {
        resolve(getEthApiBaseUrl());
    });
};

/**
 * dataCenter更新余额
 */
export const callDcUpdateBalance = (addr: string, currencyName: string) => {
    return new Promise((resolve) => {
        dcUpdateBalance(addr, currencyName);
        resolve();
    });
};

/**
 * dataCenter刷新本地钱包
 */
export const callDcRefreshAllTx = () => {
    return new Promise((resolve) => {
        dcRefreshAllTx();
        resolve();
    });
};

/**
 * dataCenter初始化ERC20代币GasLimit
 */
export const callDcInitErc20GasLimit = () => {
    return new Promise((resolve) => {
        dcInitErc20GasLimit();
        resolve();
    });
};

/**
 * dataCenter更新地址相关 交易记录及余额定时更新
 */
export const callDcUpdateAddrInfo = (addr: string, currencyName: string) => {
    return new Promise((resolve) => {
        dcUpdateAddrInfo(addr,currencyName);
        resolve();
    });
};

/**
 * dataCenter通过hash清楚定时器
 */
export const callDcClearTxTimer = (hash: string) => {
    return new Promise((resolve) => {
        dcClearTxTimer(hash);
        resolve();
    });
};
/**
 * 验证当前账户身份
 * @param passwd 密码
 */
export const callVerifyIdentidy = (passwd:string) => {
    return new Promise((resolve) => {
        VerifyIdentidy(passwd).then(hash => {
            resolve(hash);
        });
    });
};

/**
 * 验证某个账户身份
 */
export const callVerifyIdentidy1 = (passwd:string,vault:string,salt:string) => {
    return new Promise((resolve) => {
        VerifyIdentidy1(passwd,vault,salt).then(hash => {
            resolve(hash);
        });
    });
};

/**
 * 随机创建钱包
 */
export const callCreateWalletRandom = (option: CreateWalletOption,tourist?:boolean) => {
    return createWalletRandom(option,tourist);
};

/**
 * 通过助记词导入钱包
 */
export const callImportWalletByMnemonic = (option: CreateWalletOption) => {
    return importWalletByMnemonic(option);
};

/**
 * 图片创建钱包
 */
export const callCreateWalletByImage = (option: CreateWalletOption) => {
    return createWalletByImage(option);
};

/**
 * 冗余助记词导入
 */
export const callImportWalletByFragment = (option: CreateWalletOption) => {
    return importWalletByFragment(option);
};

/**
 * 创建新地址
 */
export const callCreateNewAddr = (passwd: string, currencyName: string) => {
    return new Promise((resolve,reject) => {
        createNewAddr(passwd,currencyName).then(successed => {
            if (successed) {
                resolve();
            } else {
                reject();
            }
        });
    });
};

/**
 * 备份助记词
 * @param passwd 密码 
 */
export const callBackupMnemonic = (passwd:string,needFragments:boolean = true) => {
    return backupMnemonic(passwd,needFragments);
};

/**
 * 修改密码
 */
export const callPasswordChange = (secretHash: string, newPsw: string) => {
    return passwordChange(secretHash,newPsw);
};

/**
 * 获取矿工费
 */
export const callFetchMinerFeeList = (currencyName:string) => {
    return new Promise(resolve => {
        resolve(fetchMinerFeeList(currencyName));
    });
};

// 获取gasPrice
export const callFetchGasPrice = (minerFeeLevel: MinerFeeLevel) => {
    return new Promise(resolve => {
        resolve(fetchGasPrice(minerFeeLevel));
    });
};

/**
 * 获取某个地址的交易记录
 */
export const callFetchTransactionList = (addr:string,currencyName:string) => {
    return new Promise(resolve => {
        resolve(fetchTransactionList(addr,currencyName));
    });
};

// 根据hash获取助记词
export const callGetMnemonicByHash = (hash:string) => {
    return new Promise(resolve => {
        resolve(getMnemonicByHash(hash));
    });
};

/**
 * 增加或者删除展示的币种
 */
export const callUpdateShowCurrencys = (currencyName:string,added:boolean) => {
    return new Promise(resolve => {
        updateShowCurrencys(currencyName,added);
        resolve();
    });
};

/**
 * 普通转账
 */
export const callTransfer = (psw:string,txPayload:TxPayload) => {
    return transfer(psw,txPayload);
};

/**
 * 判断助记词是否合法
 */
export const callisValidMnemonic = (language: LANGUAGE, mnemonic: string) => {
    return new Promise(resolve => {
        resolve(isValidMnemonic(language, mnemonic));
    });
};

// 导出以太坊私钥
export const callExportETHPrivateKey = (mnemonic:string,addrs: AddrInfo[]) => {
    return new Promise(resolve => {
        resolve(exportETHPrivateKey(mnemonic, addrs));
    });
};

 // 导出BTC私钥
export const callExportBTCPrivateKey = (mnemonic:string,addrs: AddrInfo[]) => {
    return new Promise(resolve => {
        resolve(exportBTCPrivateKey(mnemonic, addrs));
    });
};

// 导出ERC20私钥
export const callExportERC20TokenPrivateKey = (mnemonic:string,addrs: AddrInfo[],currencyName:string) => {
    return new Promise(resolve => {
        resolve(exportERC20TokenPrivateKey(mnemonic, addrs,currencyName));
    });
};

/**
 * btc充值
 */
export const callBtcRecharge = (psw:string,txRecord:TxHistory) => {
    return btcRecharge(psw,txRecord);
};

/**
 * eth充值
 */
export const callEthRecharge = (psw:string,txRecord:TxHistory) => {
    return ethRecharge(psw,txRecord);
};

/**
 * btc重发充值
 */
export const callResendBtcRecharge = (psw:string,txRecord:TxHistory) => {
    return resendBtcRecharge(psw,txRecord);
};

// eth提现
export const callEthWithdraw = (secretHash:string,toAddr:string,amount:number | string) => {
    return ethWithdraw(secretHash,toAddr,amount);
};

// btc提现
export const callBtcWithdraw = (secretHash:string,toAddr:string,amount:number | string) => {
    return btcWithdraw(secretHash,toAddr,amount);
};

/**
 * 获取钱包地址的位置
 */
export const callGetWltAddrIndex = (addr: string, currencyName: string) => {
    return new Promise(resolve => {
        resolve(getWltAddrIndex(addr,currencyName));
    });
};

/**
 * 处理ETH转账
 */
export const callDoEthTransfer = (psw:string,addrIndex:number,txRecord:TxHistory) => {
    return doEthTransfer(psw,addrIndex,txRecord);
};

/**
 * btc重发
 */
export const callResendBtcTransfer = (psw:string,addrIndex:number,txRecord:TxHistory) => {
    return resendBtcTransfer(psw,addrIndex,txRecord);
};

/**
 * 处理eth代币转账
 */
export const callDoERC20TokenTransfer = (psw:string,addrIndex:number, txRecord:TxHistory) => {
    return doERC20TokenTransfer(psw,addrIndex,txRecord);
};

/**
 * ahash to argonhash
 * @param imagePsw 图片密码
 * @param ahash ahash
 */
export const callAhashToArgon2Hash = (ahash: string, imagePsw: string) => {
    return ahashToArgon2Hash(ahash,imagePsw);
};

// 锁屏密码hash算法
export const callLockScreenHash = (psw:string) => {
    return new Promise(resolve => {
        resolve(lockScreenHash(psw));
    });
};

// 锁屏密码验证
export const callLockScreenVerify = (psw:string) => {
    return new Promise(resolve => {
        resolve(lockScreenVerify(psw));
    });
};

// ===========================================wallet相关===================================================================