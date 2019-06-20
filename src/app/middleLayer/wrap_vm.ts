/**
 * 中间件
 */
import { WebViewManager } from '../../pi/browser/webview';
import { AddrInfo, CloudCurrencyType, CreateWalletOption, MinerFeeLevel, TxHistory, TxPayload } from '../publicLib/interface';

const vmName = 'JSVM';   // 虚拟机rpc通信名称

export type LANGUAGE = 'english' | 'chinese_simplified' | 'chinese_traditional' | 'japanese';

/**
 * vm rpc 调用
 * rpc调用有两种模式 callback放在rpc函数调用最后面实现对同步函数的rpc调用  放置rpcData 下params参数最后面实现对异步函数的rpc调用
 * @param data 参数 
 */
const vmRpcCall = (moduleName:string,methodName:string,params: any[]):Promise<any> => {
    return new Promise((resolve,reject) => {
        // 在params后面加入callback函数  实现对异步函数的rpc调用
        params.push(([error,res]) => { 
            if (error) reject(error);
            resolve(res);
        });
        WebViewManager.rpc(vmName,{ moduleName,methodName,params });
    });
};

// ================================模块名定义=====================================================

const MEMSTOREMODULENAME = 'app/store/memstore';   // memstore moduleName
const TOOLSMODULENAME = 'app/remote/tools';        // tools moduleName
const LOGINMODULENAME = 'app/remote/login';        // login moduleName
const PULLMODULENAME = 'app/remote/pull';          // pull moduleName
const PULLWALLETMODULENAME = 'app/remote/pullWallet';  // pullWallet moduleName
const WALLETMODULENAME = 'app/remote/wallet';          // wallet moduleName
const DATACENTERMODULENAME = 'app/remote/dataCenter';   // dataCenter moduleName
const GENMNEMONICMODULENAME = 'app/core/genmnemonic';   // genmnemonic moduleName
const CORECONFIGMODULENAME = 'app/core/config';         // core/config moduleName

// ================================模块名定义=====================================================

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
    return vmRpcCall(LOGINMODULENAME,'openConnect',[secrectHash]);
};

/**
 * 请求调用
 * @param msg 参数
 */
export const callRequestAsync = (msg: any) => {
    return vmRpcCall(LOGINMODULENAME,'requestAsync',[msg]);
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
    return vmRpcCall(LOGINMODULENAME,'requestAsyncNeedLogin',[msg,secretHash]);
};

/**
 * 获取随机数
 * flag:0 普通用户注册，1注册即为真实用户
 */
export const callGetRandom = (secretHash:string,cmd?:number,phone?:number,code?:number,num?:string) => {
    return vmRpcCall(LOGINMODULENAME,'getRandom',[secretHash,cmd,phone,code,num]);
};
/**
 * 创建钱包后默认登录
 */
export const callDefaultLogin = (hash:string,conRandom:string) => {
    return vmRpcCall(LOGINMODULENAME,'defaultLogin',[hash,conRandom]);
};

// 获取云端余额
export const callGetServerCloudBalance = () => {
    return vmRpcCall(PULLMODULENAME,'getServerCloudBalance',[]);
};

// 获取真实用户
export const callGetRealUser = () => {
    return vmRpcCall(PULLMODULENAME,'getRealUser',[]);
};

// 手动重连
export const callWalletManualReconnect = () => {
    return vmRpcCall(LOGINMODULENAME,'walletManualReconnect',[]);
};

/**
 * 注销账户保留数据
 */
export const callLogoutAccount = () => {
    return vmRpcCall(LOGINMODULENAME,'logoutAccount',[]);
};

/**
 * 注销账户并删除数据
 */
export const callLogoutAccountDel = () => {
    return vmRpcCall(LOGINMODULENAME,'logoutAccountDel',[]);
};
/**
 * 登录某个账号成功
 */
export const callLoginSuccess = (account:any,secretHash:string) => {
    return vmRpcCall(LOGINMODULENAME,'loginSuccess',[account,secretHash]);
};

/**
 * 获取gasPrice
 */
export const callFetchBtcFees = () => {
    return vmRpcCall(PULLMODULENAME,'fetchBtcFees',[]);
};

/**
 * 获取gasPrice
 */
export const callFetchGasPrices = () => {
    return vmRpcCall(PULLMODULENAME,'fetchGasPrices',[]);
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
    return vmRpcCall(PULLMODULENAME,'getHighTop',[num]);
};

/**
 * 获取指定货币流水
 * filter（0表示不过滤，1表示过滤）
 */
export const callGetAccountDetail = (coin: string,filter:number,start = '') => {
    return vmRpcCall(PULLMODULENAME,'getAccountDetail',[coin,filter,start]);
};

/**
 * 充值历史记录
 */
export const callGetRechargeLogs = (coin: string,start?) => {
    return vmRpcCall(PULLMODULENAME,'getRechargeLogs',[coin,start]);
};

/**
 * 提现历史记录
 */
export const callGetWithdrawLogs = (coin: string,start?) => {
    return vmRpcCall(PULLMODULENAME,'getWithdrawLogs',[coin,start]);
};

/**
 * 购买理财
 */
export const callBuyProduct = (pid:any,count:any,secretHash:string) => {
    return vmRpcCall(PULLMODULENAME,'buyProduct',[pid,count,secretHash]);
};

/**
 * 获取理财列表
 */
export const callGetProductList = () => {
    return vmRpcCall(PULLMODULENAME,'getProductList',[]);
};

/**
 * 理财购买记录
 */
export const callGetPurchaseRecord = (start = '') => {
    return vmRpcCall(PULLMODULENAME,'getPurchaseRecord',[start]);
};

/**
 * 查询发送红包记录
 */
export const callQuerySendRedEnvelopeRecord = (start?: string) => {
    return vmRpcCall(PULLMODULENAME,'querySendRedEnvelopeRecord',[start]);
};

/**
 * 查询某个红包兑换详情
 */
export const callQueryDetailLog = (uid:number,rid: string,accId?:string) => {
    return vmRpcCall(PULLMODULENAME,'queryDetailLog',[uid,rid,accId]);
};

/**
 * 获取分红汇总信息
 */
export const callGetDividend = () => {
    return vmRpcCall(PULLMODULENAME,'getDividend',[]);
};

/**
 * 获取分红历史记录
 */
export const callGetDividHistory = (start = '') => {
    return vmRpcCall(PULLMODULENAME,'getDividHistory',[start]);
};

/**
 * 获取挖矿汇总信息
 */
export const callGetMining = () => {
    return vmRpcCall(PULLMODULENAME,'getMining',[]);
};

/**
 * 矿山增加记录
 */
export const callGetMineDetail = (start = '') => {
    return vmRpcCall(PULLMODULENAME,'getMineDetail',[start]);
};

/**
 * 查询红包兑换记录
 */
export const callQueryConvertLog = (start?:string) => {
    return vmRpcCall(PULLMODULENAME,'queryConvertLog',[start]);
};

// ===========================================net相关===================================================================

// ===========================================wallet相关===================================================================

/**
 * 获取eth api url
 */
export const callGetEthApiBaseUrl = () => {
    return vmRpcCall(CORECONFIGMODULENAME,'getEthApiBaseUrl',[]);
};

/**
 * dataCenter更新余额
 */
export const callDcUpdateBalance = (addr: string, currencyName: string) => {
    return vmRpcCall(DATACENTERMODULENAME,'dcUpdateBalance',[addr,currencyName]);
};

/**
 * dataCenter刷新本地钱包
 */
export const callDcRefreshAllTx = () => {
    return vmRpcCall(DATACENTERMODULENAME,'dcRefreshAllTx',[]);
};

/**
 * dataCenter初始化ERC20代币GasLimit
 */
export const callDcInitErc20GasLimit = () => {
    return vmRpcCall(DATACENTERMODULENAME,'dcInitErc20GasLimit',[]);
};

/**
 * dataCenter更新地址相关 交易记录及余额定时更新
 */
export const callDcUpdateAddrInfo = (addr: string, currencyName: string) => {
    return vmRpcCall(DATACENTERMODULENAME,'dcUpdateAddrInfo',[addr,currencyName]);
};

/**
 * dataCenter通过hash清楚定时器
 */
export const callDcClearTxTimer = (hash: string) => {
    return vmRpcCall(DATACENTERMODULENAME,'dcClearTxTimer',[hash]);
};
/**
 * 验证当前账户身份
 * @param passwd 密码
 */
export const callVerifyIdentidy = (passwd:string) => {
    return vmRpcCall(WALLETMODULENAME,'VerifyIdentidy',[passwd]);
};

/**
 * 验证某个账户身份
 */
export const callVerifyIdentidy1 = (passwd:string,vault:string,salt:string) => {
    return vmRpcCall(WALLETMODULENAME,'VerifyIdentidy1',[passwd,vault,salt]);
};

/**
 * 随机创建钱包
 */
export const callCreateWalletRandom = (option: CreateWalletOption,tourist?:boolean) => {
    return vmRpcCall(WALLETMODULENAME,'createWalletRandom',[option,tourist]);
};

/**
 * 通过助记词导入钱包
 */
export const callImportWalletByMnemonic = (option: CreateWalletOption) => {
    return vmRpcCall(WALLETMODULENAME,'importWalletByMnemonic',[option]);
};

/**
 * 图片创建钱包
 */
export const callCreateWalletByImage = (option: CreateWalletOption) => {
    return vmRpcCall(WALLETMODULENAME,'createWalletByImage',[option]);
};

/**
 * 冗余助记词导入
 */
export const callImportWalletByFragment = (option: CreateWalletOption) => {
    return vmRpcCall(WALLETMODULENAME,'importWalletByFragment',[option]);
};

/**
 * 创建新地址
 */
export const callCreateNewAddr = (passwd: string, currencyName: string) => {
    return vmRpcCall(WALLETMODULENAME,'createNewAddr',[passwd,currencyName]);
};

/**
 * 备份助记词
 * @param passwd 密码 
 */
export const callBackupMnemonic = (passwd:string,needFragments:boolean = true) => {
    return vmRpcCall(WALLETMODULENAME,'backupMnemonic',[passwd,needFragments]);
};

/**
 * 修改密码
 */
export const callPasswordChange = (secretHash: string, newPsw: string) => {
    return vmRpcCall(WALLETMODULENAME,'passwordChange',[secretHash,newPsw]);
};

/**
 * 获取矿工费
 */
export const callFetchMinerFeeList = (currencyName:string) => {
    return vmRpcCall(WALLETMODULENAME,'fetchMinerFeeList',[currencyName]);
};

// 获取gasPrice
export const callFetchGasPrice = (minerFeeLevel: MinerFeeLevel) => {
    return vmRpcCall(WALLETMODULENAME,'fetchGasPrice',[minerFeeLevel]);
};

/**
 * 获取某个地址的交易记录
 */
export const callFetchTransactionList = (addr:string,currencyName:string) => {
    return vmRpcCall(WALLETMODULENAME,'fetchTransactionList',[addr,currencyName]);
};

// 根据hash获取助记词
export const callGetMnemonicByHash = (hash:string) => {
    return vmRpcCall(WALLETMODULENAME,'getMnemonicByHash',[hash]);
};

/**
 * 增加或者删除展示的币种
 */
export const callUpdateShowCurrencys = (currencyName:string,added:boolean) => {
    return vmRpcCall(WALLETMODULENAME,'updateShowCurrencys',[currencyName,added]);
};

/**
 * 普通转账
 */
export const callTransfer = (psw:string,txPayload:TxPayload) => {
    return vmRpcCall(PULLWALLETMODULENAME,'transfer',[psw,txPayload]);
};

/**
 * 判断助记词是否合法
 */
export const callisValidMnemonic = (language: LANGUAGE, mnemonic: string) => {
    return vmRpcCall(GENMNEMONICMODULENAME,'isValidMnemonic',[language, mnemonic]);
};

// 导出以太坊私钥
export const callExportETHPrivateKey = (mnemonic:string,addrs: AddrInfo[]) => {
    return vmRpcCall(WALLETMODULENAME,'exportETHPrivateKey',[mnemonic, addrs]);
};

 // 导出BTC私钥
export const callExportBTCPrivateKey = (mnemonic:string,addrs: AddrInfo[]) => {
    return vmRpcCall(WALLETMODULENAME,'exportBTCPrivateKey',[mnemonic, addrs]);
};

// 导出ERC20私钥
export const callExportERC20TokenPrivateKey = (mnemonic:string,addrs: AddrInfo[],currencyName:string) => {
    return vmRpcCall(WALLETMODULENAME,'exportERC20TokenPrivateKey',[mnemonic, addrs,currencyName]);
};

/**
 * btc充值
 */
export const callBtcRecharge = (psw:string,txRecord:TxHistory) => {
    return vmRpcCall(PULLWALLETMODULENAME,'btcRecharge',[psw,txRecord]);
};

/**
 * eth充值
 */
export const callEthRecharge = (psw:string,txRecord:TxHistory) => {
    return vmRpcCall(PULLWALLETMODULENAME,'ethRecharge',[psw,txRecord]);
};

/**
 * btc重发充值
 */
export const callResendBtcRecharge = (psw:string,txRecord:TxHistory) => {
    return vmRpcCall(PULLWALLETMODULENAME,'resendBtcRecharge',[psw,txRecord]);
};

// eth提现
export const callEthWithdraw = (secretHash:string,toAddr:string,amount:number | string) => {
    return vmRpcCall(PULLWALLETMODULENAME,'ethWithdraw',[secretHash,toAddr,amount]);
};

// btc提现
export const callBtcWithdraw = (secretHash:string,toAddr:string,amount:number | string) => {
    return vmRpcCall(PULLWALLETMODULENAME,'btcWithdraw',[secretHash,toAddr,amount]);
};

/**
 * 获取钱包地址的位置
 */
export const callGetWltAddrIndex = (addr: string, currencyName: string) => {
    return vmRpcCall(WALLETMODULENAME,'getWltAddrIndex',[addr,currencyName]);
};

/**
 * 处理ETH转账
 */
export const callDoEthTransfer = (psw:string,addrIndex:number,txRecord:TxHistory) => {
    return vmRpcCall(PULLWALLETMODULENAME,'doEthTransfer',[psw,addrIndex,txRecord]);
};

/**
 * btc重发
 */
export const callResendBtcTransfer = (psw:string,addrIndex:number,txRecord:TxHistory) => {
    return vmRpcCall(PULLWALLETMODULENAME,'resendBtcTransfer',[psw,addrIndex,txRecord]);
};

/**
 * 处理eth代币转账
 */
export const callDoERC20TokenTransfer = (psw:string,addrIndex:number, txRecord:TxHistory) => {
    return vmRpcCall(PULLWALLETMODULENAME,'doERC20TokenTransfer',[psw,addrIndex,txRecord]);
};

/**
 * ahash to argonhash
 * @param imagePsw 图片密码
 * @param ahash ahash
 */
export const callAhashToArgon2Hash = (ahash: string, imagePsw: string) => {
    return vmRpcCall(WALLETMODULENAME,'ahashToArgon2Hash',[ahash,imagePsw]);
};

// 锁屏密码hash算法
export const callLockScreenHash = (psw:string) => {
    return vmRpcCall(WALLETMODULENAME,'lockScreenHash',[psw]);
};

// 锁屏密码验证
export const callLockScreenVerify = (psw:string) => {
    return vmRpcCall(WALLETMODULENAME,'lockScreenVerify',[psw]);
};

// ===========================================wallet相关===================================================================