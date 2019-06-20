/**
 * 中间件
 */
import { WebViewManager } from '../../pi/browser/webview';
import { AddrInfo, CloudCurrencyType, CreateWalletOption, MinerFeeLevel, TxHistory, TxPayload } from '../publicLib/interface';

const vmName = 'JSVM';   // 虚拟机rpc通信名称
const COREWRAPMODULENAME = 'app/remote/coreWrap';   // coreWrap moduleName

export type LANGUAGE = 'english' | 'chinese_simplified' | 'chinese_traditional' | 'japanese';

/**
 * vm rpc 调用
 * rpc调用有两种模式 callback放在rpc函数调用最后面实现对同步函数的rpc调用  放置rpcData 下params参数最后面实现对异步函数的rpc调用
 * @param data 参数 
 */
const vmRpcCall = (methodName:string,params: any[]):Promise<any> => {
    return new Promise((resolve,reject) => {
        // 在params后面加入callback函数  实现对异步函数的rpc调用
        params.push(([error,res]) => { 
            if (error) reject(error);
            resolve(res);
        });
        WebViewManager.rpc(vmName,{ moduleName:COREWRAPMODULENAME,methodName,params });
    });
};

// ===========================================memstroe相关===================================================================

/**
 * 获取store数据
 */
export const getStoreData = (key:string, defaultValue = undefined) => {
    return vmRpcCall('getStore',[key,defaultValue]);
};

/**
 * 更新store并通知
 */
export const setStoreData = (path: string, data: any, notified = true) => {
    return vmRpcCall('setStore',[path,data,notified]);
};

/**
 * 获取所有的账户列表
 */
export const callGetAllAccount = () => {
    return vmRpcCall('getAllAccount',[]);
};

/**
 * 获取云端余额
 */
export const callGetCloudBalances = () => {
    return vmRpcCall('getCloudBalances',[]);
};

/**
 * 删除账户
 */
export const callDeleteAccount = (id: string) => {
    return vmRpcCall('deleteAccount',[id]);
};

// ===========================================memstroe相关===================================================================

// ===========================================tools相关===================================================================

/**
 * 删除本地交易记录
 */
export const callDeletLocalTx = (tx: TxHistory) => {
    return vmRpcCall('deletLocalTx',[tx]);
};

/**
 * 获取云端总资产
 */
export const callFetchCloudTotalAssets = () => {
    return vmRpcCall('fetchCloudTotalAssets',[]);
};

/**
 * 获取总资产
 */
export const callFetchLocalTotalAssets = () => {
    return vmRpcCall('fetchLocalTotalAssets',[]);
};
/**
 * 获取本地钱包资产列表
 */
export const callFetchWalletAssetList = () => {
    return vmRpcCall('fetchWalletAssetList',[]);
};

/**
 * 获取云端钱包资产列表
 */
export const callFetchCloudWalletAssetList = () => {
    return vmRpcCall('fetchCloudWalletAssetList',[]);
};

// 计算支持的币币兑换的币种
export const callCurrencyExchangeAvailable = () => {
    return vmRpcCall('currencyExchangeAvailable',[]);
};

/**
 * 获取某个币种对应的货币价值即汇率
 */
export const callFetchBalanceValueOfCoin = (currencyName: string | CloudCurrencyType, balance: number) => {
    return vmRpcCall('fetchBalanceValueOfCoin',[currencyName,balance]);
};

// 获取货币的涨跌情况
export const callFetchCoinGain = (currencyName: string) => {
    return vmRpcCall('fetchCoinGain',[currencyName]);
};

/**
 * 获取钱包下指定货币类型的所有地址信息
 * @param wallet wallet obj
 */
export const callGetAddrsInfoByCurrencyName = (currencyName: string) => {
    return vmRpcCall('getAddrsInfoByCurrencyName',[currencyName]);
};

/**
 * 获取当前钱包对应货币正在使用的地址信息
 * @param currencyName 货币类型
 */
export const callGetCurrentAddrInfo = (currencyName: string) => {
    return vmRpcCall('getCurrentAddrInfo',[currencyName]);
};

/**
 * 更新本地交易记录
 */
export const callUpdateLocalTx = (tx: TxHistory) => {
    return vmRpcCall('updateLocalTx',[tx]);
};

// ===========================================tools相关===================================================================

// ===========================================net相关===================================================================

/**
 * 开启ws连接
 */
export const openWSConnect = (secrectHash:string = '') => {
    return vmRpcCall('openConnect',[secrectHash]);
};

/**
 * 请求调用
 * @param msg 参数
 */
export const callRequestAsync = (msg: any) => {
    return vmRpcCall('requestAsync',[msg]);
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
    return vmRpcCall('requestAsyncNeedLogin',[msg,secretHash]);
};

/**
 * 获取随机数
 * flag:0 普通用户注册，1注册即为真实用户
 */
export const callGetRandom = (secretHash:string,cmd?:number,phone?:number,code?:number,num?:string) => {
    return vmRpcCall('getRandom',[secretHash,cmd,phone,code,num]);
};
/**
 * 创建钱包后默认登录
 */
export const callDefaultLogin = (hash:string,conRandom:string) => {
    return vmRpcCall('defaultLogin',[hash,conRandom]);
};

// 获取云端余额
export const callGetServerCloudBalance = () => {
    return vmRpcCall('getServerCloudBalance',[]);
};

// 获取真实用户
export const callGetRealUser = () => {
    return vmRpcCall('getRealUser',[]);
};

// 手动重连
export const callWalletManualReconnect = () => {
    return vmRpcCall('walletManualReconnect',[]);
};

/**
 * 注销账户保留数据
 */
export const callLogoutAccount = () => {
    return vmRpcCall('logoutAccount',[]);
};

/**
 * 注销账户并删除数据
 */
export const callLogoutAccountDel = () => {
    return vmRpcCall('logoutAccountDel',[]);
};
/**
 * 登录某个账号成功
 */
export const callLoginSuccess = (account:any,secretHash:string) => {
    return vmRpcCall('loginSuccess',[account,secretHash]);
};

/**
 * 获取gasPrice
 */
export const callFetchBtcFees = () => {
    return vmRpcCall('fetchBtcFees',[]);
};

/**
 * 获取gasPrice
 */
export const callFetchGasPrices = () => {
    return vmRpcCall('fetchGasPrices',[]);
};

/**
 * 授权用户openID接口
 * @param appId appId 
 */
export const callGetOpenId = (appId:string) => {
    return vmRpcCall('getOpenId',[appId]);
};

/**
 * 获取全部用户嗨豆排名列表
 */
export const callGetHighTop = (num: number) => {
    return vmRpcCall('getHighTop',[num]);
};

/**
 * 获取指定货币流水
 * filter（0表示不过滤，1表示过滤）
 */
export const callGetAccountDetail = (coin: string,filter:number,start = '') => {
    return vmRpcCall('getAccountDetail',[coin,filter,start]);
};

/**
 * 充值历史记录
 */
export const callGetRechargeLogs = (coin: string,start?) => {
    return vmRpcCall('getRechargeLogs',[coin,start]);
};

/**
 * 提现历史记录
 */
export const callGetWithdrawLogs = (coin: string,start?) => {
    return vmRpcCall('getWithdrawLogs',[coin,start]);
};

/**
 * 购买理财
 */
export const callBuyProduct = (pid:any,count:any,secretHash:string) => {
    return vmRpcCall('buyProduct',[pid,count,secretHash]);
};

/**
 * 获取理财列表
 */
export const callGetProductList = () => {
    return vmRpcCall('getProductList',[]);
};

/**
 * 理财购买记录
 */
export const callGetPurchaseRecord = (start = '') => {
    return vmRpcCall('getPurchaseRecord',[start]);
};

/**
 * 查询发送红包记录
 */
export const callQuerySendRedEnvelopeRecord = (start?: string) => {
    return vmRpcCall('querySendRedEnvelopeRecord',[start]);
};

/**
 * 查询某个红包兑换详情
 */
export const callQueryDetailLog = (uid:number,rid: string,accId?:string) => {
    return vmRpcCall('queryDetailLog',[uid,rid,accId]);
};

/**
 * 获取分红汇总信息
 */
export const callGetDividend = () => {
    return vmRpcCall('getDividend',[]);
};

/**
 * 获取分红历史记录
 */
export const callGetDividHistory = (start = '') => {
    return vmRpcCall('getDividHistory',[start]);
};

/**
 * 获取挖矿汇总信息
 */
export const callGetMining = () => {
    return vmRpcCall('getMining',[]);
};

/**
 * 矿山增加记录
 */
export const callGetMineDetail = (start = '') => {
    return vmRpcCall('getMineDetail',[start]);
};

/**
 * 查询红包兑换记录
 */
export const callQueryConvertLog = (start?:string) => {
    return vmRpcCall('queryConvertLog',[start]);
};

// ===========================================net相关===================================================================

// ===========================================wallet相关===================================================================

/**
 * 获取eth api url
 */
export const callGetEthApiBaseUrl = () => {
    return vmRpcCall('getEthApiBaseUrl',[]);
};

/**
 * dataCenter更新余额
 */
export const callDcUpdateBalance = (addr: string, currencyName: string) => {
    return vmRpcCall('dcUpdateBalance',[addr,currencyName]);
};

/**
 * dataCenter刷新本地钱包
 */
export const callDcRefreshAllTx = () => {
    return vmRpcCall('dcRefreshAllTx',[]);
};

/**
 * dataCenter初始化ERC20代币GasLimit
 */
export const callDcInitErc20GasLimit = () => {
    return vmRpcCall('dcInitErc20GasLimit',[]);
};

/**
 * dataCenter更新地址相关 交易记录及余额定时更新
 */
export const callDcUpdateAddrInfo = (addr: string, currencyName: string) => {
    return vmRpcCall('dcUpdateAddrInfo',[addr,currencyName]);
};

/**
 * dataCenter通过hash清楚定时器
 */
export const callDcClearTxTimer = (hash: string) => {
    return vmRpcCall('dcClearTxTimer',[hash]);
};
/**
 * 验证当前账户身份
 * @param passwd 密码
 */
export const callVerifyIdentidy = (passwd:string) => {
    return vmRpcCall('VerifyIdentidy',[passwd]);
};

/**
 * 验证某个账户身份
 */
export const callVerifyIdentidy1 = (passwd:string,vault:string,salt:string) => {
    return vmRpcCall('VerifyIdentidy1',[passwd,vault,salt]);
};

/**
 * 随机创建钱包
 */
export const callCreateWalletRandom = (option: CreateWalletOption,tourist?:boolean) => {
    return vmRpcCall('createWalletRandom',[option,tourist]);
};

/**
 * 通过助记词导入钱包
 */
export const callImportWalletByMnemonic = (option: CreateWalletOption) => {
    return vmRpcCall('importWalletByMnemonic',[option]);
};

/**
 * 图片创建钱包
 */
export const callCreateWalletByImage = (option: CreateWalletOption) => {
    return vmRpcCall('createWalletByImage',[option]);
};

/**
 * 冗余助记词导入
 */
export const callImportWalletByFragment = (option: CreateWalletOption) => {
    return vmRpcCall('importWalletByFragment',[option]);
};

/**
 * 创建新地址
 */
export const callCreateNewAddr = (passwd: string, currencyName: string) => {
    return vmRpcCall('createNewAddr',[passwd,currencyName]);
};

/**
 * 备份助记词
 * @param passwd 密码 
 */
export const callBackupMnemonic = (passwd:string,needFragments:boolean = true) => {
    return vmRpcCall('backupMnemonic',[passwd,needFragments]);
};

/**
 * 修改密码
 */
export const callPasswordChange = (secretHash: string, newPsw: string) => {
    return vmRpcCall('passwordChange',[secretHash,newPsw]);
};

/**
 * 获取矿工费
 */
export const callFetchMinerFeeList = (currencyName:string) => {
    return vmRpcCall('fetchMinerFeeList',[currencyName]);
};

// 获取gasPrice
export const callFetchGasPrice = (minerFeeLevel: MinerFeeLevel) => {
    return vmRpcCall('fetchGasPrice',[minerFeeLevel]);
};

/**
 * 获取某个地址的交易记录
 */
export const callFetchTransactionList = (addr:string,currencyName:string) => {
    return vmRpcCall('fetchTransactionList',[addr,currencyName]);
};

// 根据hash获取助记词
export const callGetMnemonicByHash = (hash:string) => {
    return vmRpcCall('getMnemonicByHash',[hash]);
};

/**
 * 增加或者删除展示的币种
 */
export const callUpdateShowCurrencys = (currencyName:string,added:boolean) => {
    return vmRpcCall('updateShowCurrencys',[currencyName,added]);
};

/**
 * 普通转账
 */
export const callTransfer = (psw:string,txPayload:TxPayload) => {
    return vmRpcCall('transfer',[psw,txPayload]);
};

/**
 * 判断助记词是否合法
 */
export const callisValidMnemonic = (language: LANGUAGE, mnemonic: string) => {
    return vmRpcCall('isValidMnemonic',[language, mnemonic]);
};

// 导出以太坊私钥
export const callExportETHPrivateKey = (mnemonic:string,addrs: AddrInfo[]) => {
    return vmRpcCall('exportETHPrivateKey',[mnemonic, addrs]);
};

 // 导出BTC私钥
export const callExportBTCPrivateKey = (mnemonic:string,addrs: AddrInfo[]) => {
    return vmRpcCall('exportBTCPrivateKey',[mnemonic, addrs]);
};

// 导出ERC20私钥
export const callExportERC20TokenPrivateKey = (mnemonic:string,addrs: AddrInfo[],currencyName:string) => {
    return vmRpcCall('exportERC20TokenPrivateKey',[mnemonic, addrs,currencyName]);
};

/**
 * btc充值
 */
export const callBtcRecharge = (psw:string,txRecord:TxHistory) => {
    return vmRpcCall('btcRecharge',[psw,txRecord]);
};

/**
 * eth充值
 */
export const callEthRecharge = (psw:string,txRecord:TxHistory) => {
    return vmRpcCall('ethRecharge',[psw,txRecord]);
};

/**
 * btc重发充值
 */
export const callResendBtcRecharge = (psw:string,txRecord:TxHistory) => {
    return vmRpcCall('resendBtcRecharge',[psw,txRecord]);
};

// eth提现
export const callEthWithdraw = (secretHash:string,toAddr:string,amount:number | string) => {
    return vmRpcCall('ethWithdraw',[secretHash,toAddr,amount]);
};

// btc提现
export const callBtcWithdraw = (secretHash:string,toAddr:string,amount:number | string) => {
    return vmRpcCall('btcWithdraw',[secretHash,toAddr,amount]);
};

/**
 * 获取钱包地址的位置
 */
export const callGetWltAddrIndex = (addr: string, currencyName: string) => {
    return vmRpcCall('getWltAddrIndex',[addr,currencyName]);
};

/**
 * 处理ETH转账
 */
export const callDoEthTransfer = (psw:string,addrIndex:number,txRecord:TxHistory) => {
    return vmRpcCall('doEthTransfer',[psw,addrIndex,txRecord]);
};

/**
 * btc重发
 */
export const callResendBtcTransfer = (psw:string,addrIndex:number,txRecord:TxHistory) => {
    return vmRpcCall('resendBtcTransfer',[psw,addrIndex,txRecord]);
};

/**
 * 处理eth代币转账
 */
export const callDoERC20TokenTransfer = (psw:string,addrIndex:number, txRecord:TxHistory) => {
    return vmRpcCall('doERC20TokenTransfer',[psw,addrIndex,txRecord]);
};

/**
 * ahash to argonhash
 * @param imagePsw 图片密码
 * @param ahash ahash
 */
export const callAhashToArgon2Hash = (ahash: string, imagePsw: string) => {
    return vmRpcCall('ahashToArgon2Hash',[ahash,imagePsw]);
};

// 锁屏密码hash算法
export const callLockScreenHash = (psw:string) => {
    return vmRpcCall('lockScreenHash',[psw]);
};

// 锁屏密码验证
export const callLockScreenVerify = (psw:string) => {
    return vmRpcCall('lockScreenVerify',[psw]);
};

// ===========================================wallet相关===================================================================