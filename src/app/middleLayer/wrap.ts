/**
 * 中间件
 */
import { WebViewManager } from '../../pi/browser/webview';
import { LANGUAGE } from '../publicLib/config';
import { AddrInfo, CloudCurrencyType, CreateWalletOption, MinerFeeLevel, TxHistory, TxPayload } from '../publicLib/interface';
import { piLoadDir } from '../utils/commonjsTools';

export const vmName = 'JSVM';   // 虚拟机rpc通信名称
export const COREWRAPMODULENAME = 'app/remote/coreWrap';   // coreWrap moduleName

const inApp = navigator.userAgent.indexOf('YINENG') >= 0;     // 是否是移动端

const obj = {};
let count = 0;

/**
 * vm rpc 调用
 * rpc调用有两种模式 callback放在rpc函数调用最后面实现对同步函数的rpc调用  放置rpcData 下params参数最后面实现对异步函数的rpc调用
 * @param data 参数 
 */
const vmRpcCall = (methodName:string,params: any[]):Promise<any> => {
    count++;
    // if (count > 0) {
    //     return Promise.resolve();
    // }
   
    return loadMod().then(() => {
        return new Promise((resolve,reject) => {
            let count = obj[methodName] || 0;
            obj[methodName] = ++count;
            // console.log(`vmRpcCall ${methodName} params = `,params);
            // 在params后面加入callback函数  实现对异步函数的rpc调用
            params.push(([error,res]) => { 
                if (error) reject(error);
                // console.log(`vmRpcCall method ${methodName} end = `,new Date().getTime());
                resolve(res);
            });
            // console.log(`vmRpcCall method ${methodName} start = `,new Date().getTime());
            WebViewManager.rpc(vmName,{ moduleName:COREWRAPMODULENAME,methodName,params });
        });

    });
};

// 加载模块  pc端loadDir加载  移动端默认已经加载完成
const loadMod = ():Promise<any> => {
    if (!inApp) return loadPcMod();

    return Promise.resolve();
};

// 在pc端加载放入vm中的模块
const loadPcMod = () => {
    const sourceList = [
        'app/core/',
        'app/remote/',
        'app/store/'
    ];

    return piLoadDir(sourceList);
};

// ===========================================memstroe相关===================================================================

/**
 * 获取store数据
 */
export const getStoreData = (key:string, defaultValue = undefined) => {
    return vmRpcCall('getStoreData',[key,defaultValue]);
};

/**
 * 更新store并通知
 */
export const setStoreData = (path: string, data: any, notified = true) => {
    return vmRpcCall('setStoreData',[path,data,notified]);
};

/**
 * 获取所有的账户列表
 */
export const callGetAllAccount = () => {
    return vmRpcCall('callGetAllAccount',[]);
};

/**
 * 获取云端余额
 */
export const callGetCloudBalances = () => {
    return vmRpcCall('callGetCloudBalances',[]);
};

/**
 * 获取云端钱包
 */
export const callGetCloudWallets = () => {
    return vmRpcCall('callGetCloudWallets',[]);
};

/**
 * 删除账户
 */
export const callDeleteAccount = (id: string) => {
    return vmRpcCall('callDeleteAccount',[id]);
};

/**
 * 获取首页登录所需数据
 */
export const callGetHomePageEnterData = () => {
    return vmRpcCall('callGetHomePageEnterData',[]);
};
// ===========================================memstroe相关===================================================================

// ===========================================tools相关===================================================================

/**
 * 删除本地交易记录
 */
export const callDeletLocalTx = (tx: TxHistory) => {
    return vmRpcCall('callDeletLocalTx',[tx]);
};

/**
 * 获取云端总资产
 */
export const callFetchCloudTotalAssets = () => {
    return vmRpcCall('callFetchCloudTotalAssets',[]);
};

/**
 * 获取总资产
 */
export const callFetchLocalTotalAssets = () => {
    return vmRpcCall('callFetchLocalTotalAssets',[]);
};
/**
 * 获取本地钱包资产列表
 */
export const callFetchWalletAssetList = () => {
    return vmRpcCall('callFetchWalletAssetList',[]);
};

/**
 * 获取云端钱包资产列表
 */
export const callFetchCloudWalletAssetList = () => {
    return vmRpcCall('callFetchCloudWalletAssetList',[]);
};

// 计算支持的币币兑换的币种
export const callCurrencyExchangeAvailable = () => {
    return vmRpcCall('callCurrencyExchangeAvailable',[]);
};

/**
 * 获取某个币种对应的货币价值即汇率
 */
export const callFetchBalanceValueOfCoin = (currencyName: string | CloudCurrencyType, balance: number) => {
    return vmRpcCall('callFetchBalanceValueOfCoin',[currencyName,balance]);
};

// 获取货币的涨跌情况
export const callFetchCoinGain = (currencyName: string) => {
    return vmRpcCall('callFetchCoinGain',[currencyName]);
};

/**
 * 获取钱包下指定货币类型的所有地址信息
 * @param wallet wallet obj
 */
export const callGetAddrsInfoByCurrencyName = (currencyName: string) => {
    return vmRpcCall('callGetAddrsInfoByCurrencyName',[currencyName]);
};

/**
 * 获取当前钱包对应货币正在使用的地址信息
 * @param currencyName 货币类型
 */
export const callGetCurrentAddrInfo = (currencyName: string) => {
    return vmRpcCall('callGetCurrentAddrInfo',[currencyName]);
};

/**
 * 更新本地交易记录
 */
export const callUpdateLocalTx = (tx: TxHistory) => {
    return vmRpcCall('callUpdateLocalTx',[tx]);
};

// ===========================================tools相关===================================================================

// ===========================================net相关===================================================================

/**
 * 开启ws连接
 */
export const openWSConnect = (secrectHash:string = '') => {
    return vmRpcCall('openWSConnect',[secrectHash]);
};

/**
 * 请求调用
 * @param msg 参数
 */
export const callRequestAsync = (msg: any) => {
    return vmRpcCall('callRequestAsync',[msg]);
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
    return vmRpcCall('callRequestAsyncNeedLogin',[msg,secretHash]);
};

/**
 * 获取随机数
 * flag:0 普通用户注册，1注册即为真实用户
 */
export const callGetRandom = (secretHash:string,cmd?:number,phone?:number,code?:number,num?:string) => {
    return vmRpcCall('callGetRandom',[secretHash,cmd,phone,code,num]);
};
/**
 * 创建钱包后默认登录
 */
export const callDefaultLogin = (hash:string,conRandom:string) => {
    return vmRpcCall('callDefaultLogin',[hash,conRandom]);
};

// 获取云端余额
export const callGetServerCloudBalance = () => {
    return vmRpcCall('callGetServerCloudBalance',[]);
};

// 手动重连
export const callWalletManualReconnect = () => {
    return vmRpcCall('callWalletManualReconnect',[]);
};

/**
 * 注销账户保留数据
 */
export const callLogoutAccount = (save:boolean = true) => {
    return vmRpcCall('callLogoutAccount',[save]);
};

/**
 * 登录某个账号成功
 */
export const callLoginSuccess = (account:any,secretHash:string) => {
    return vmRpcCall('callLoginSuccess',[account,secretHash]);
};

/**
 * 获取gasPrice
 */
export const callFetchBtcFees = () => {
    return vmRpcCall('callFetchBtcFees',[]);
};

/**
 * 获取gasPrice
 */
export const callFetchGasPrices = () => {
    return vmRpcCall('callFetchGasPrices',[]);
};

/**
 * 授权用户openID接口
 * @param appId appId 
 */
export const callGetOpenId = (appId:string) => {
    return vmRpcCall('callGetOpenId',[appId]);
};

/**
 * 获取全部用户嗨豆排名列表
 */
export const callGetHighTop = (num: number) => {
    return vmRpcCall('callGetHighTop',[num]);
};

/**
 * 获取指定货币流水
 * filter（0表示不过滤，1表示过滤）
 */
export const callGetAccountDetail = (coin: string,filter:number,start = '') => {
    return vmRpcCall('callGetAccountDetail',[coin,filter,start]);
};

/**
 * 充值历史记录
 */
export const callGetRechargeLogs = (coin: string,start?) => {
    return vmRpcCall('callGetRechargeLogs',[coin,start]);
};

/**
 * 提现历史记录
 */
export const callGetWithdrawLogs = (coin: string,start?) => {
    return vmRpcCall('callGetWithdrawLogs',[coin,start]);
};

/**
 * 购买理财
 */
export const callBuyProduct = (pid:any,count:any,secretHash:string) => {
    return vmRpcCall('callBuyProduct',[pid,count,secretHash]);
};

/**
 * 获取理财列表
 */
export const callGetProductList = () => {
    return vmRpcCall('callGetProductList',[]);
};

/**
 * 理财购买记录
 */
export const callGetPurchaseRecord = (start = '') => {
    return vmRpcCall('callGetPurchaseRecord',[start]);
};

/**
 * 查询发送红包记录
 */
export const callQuerySendRedEnvelopeRecord = (start?: string) => {
    return vmRpcCall('callQuerySendRedEnvelopeRecord',[start]);
};

/**
 * 查询某个红包兑换详情
 */
export const callQueryDetailLog = (uid:number,rid: string,accId?:string) => {
    return vmRpcCall('callQueryDetailLog',[uid,rid,accId]);
};

/**
 * 获取分红汇总信息
 */
export const callGetDividend = () => {
    return vmRpcCall('callGetDividend',[]);
};

/**
 * 获取分红历史记录
 */
export const callGetDividHistory = (start = '') => {
    return vmRpcCall('callGetDividHistory',[start]);
};

/**
 * 获取挖矿汇总信息
 */
export const callGetMining = () => {
    return vmRpcCall('callGetMining',[]);
};

/**
 * 矿山增加记录
 */
export const callGetMineDetail = (start = '') => {
    return vmRpcCall('callGetMineDetail',[start]);
};

/**
 * 查询红包兑换记录
 */
export const callQueryConvertLog = (start?:string) => {
    return vmRpcCall('callQueryConvertLog',[start]);
};

/**
 * 获取单个用户信息
 */
export const callGetOneUserInfo = (uids: number[], isOpenid: number = 0) => {
    return vmRpcCall('callGetOneUserInfo',[uids,isOpenid]);
};

/**
 * 获取邀请码
 */
export const callGetInviteCode = () => {
    return vmRpcCall('callGetInviteCode',[]);
};

// 获取好友嗨豆排名
export const callGetFriendsKTTops = (arr:any) => {
    return vmRpcCall('callGetFriendsKTTops',[arr]);
};
// ===========================================net相关===================================================================

// ===========================================wallet相关===================================================================

/**
 * 获取eth api url
 */
export const callGetEthApiBaseUrl = () => {
    return vmRpcCall('callGetEthApiBaseUrl',[]);
};

/**
 * dataCenter更新余额
 */
export const callDcUpdateBalance = (addr: string, currencyName: string) => {
    return vmRpcCall('callDcUpdateBalance',[addr,currencyName]);
};

/**
 * dataCenter刷新本地钱包
 */
export const callDcRefreshAllTx = () => {
    return vmRpcCall('callDcRefreshAllTx',[]);
};

/**
 * dataCenter初始化ERC20代币GasLimit
 */
export const callDcInitErc20GasLimit = () => {
    return vmRpcCall('callDcInitErc20GasLimit',[]);
};

/**
 * dataCenter更新地址相关 交易记录及余额定时更新
 */
export const callDcUpdateAddrInfo = (addr: string, currencyName: string) => {
    return vmRpcCall('callDcUpdateAddrInfo',[addr,currencyName]);
};

/**
 * dataCenter通过hash清楚定时器
 */
export const callDcClearTxTimer = (hash: string) => {
    return vmRpcCall('callDcClearTxTimer',[hash]);
};
/**
 * 验证当前账户身份
 * @param passwd 密码
 */
export const callVerifyIdentidy = (passwd:string) => {
    return vmRpcCall('callVerifyIdentidy',[passwd]);
};

/**
 * 验证某个账户身份
 */
export const callVerifyIdentidy1 = (passwd:string,vault:string,salt:string) => {
    return vmRpcCall('callVerifyIdentidy1',[passwd,vault,salt]);
};

/**
 * 导出ETH第一个地址私钥
 */
export const callExportPrivateKeyByMnemonic = (mnemonic:string) => {
    return vmRpcCall('callExportPrivateKeyByMnemonic',[mnemonic]);
};
/**
 * 随机创建钱包
 */
export const callCreateWalletRandom = (option: CreateWalletOption,tourist?:boolean) => {
    return vmRpcCall('callCreateWalletRandom',[option,tourist]);
};

/**
 * 通过助记词导入钱包
 */
export const callImportWalletByMnemonic = (option: CreateWalletOption) => {
    return vmRpcCall('callImportWalletByMnemonic',[option]);
};

/**
 * 图片创建钱包
 */
export const callCreateWalletByImage = (option: CreateWalletOption) => {
    return vmRpcCall('callCreateWalletByImage',[option]);
};

/**
 * 冗余助记词导入
 */
export const callImportWalletByFragment = (option: CreateWalletOption) => {
    return vmRpcCall('callImportWalletByFragment',[option]);
};

/**
 * 创建新地址
 */
export const callCreateNewAddr = (passwd: string, currencyName: string) => {
    return vmRpcCall('callCreateNewAddr',[passwd,currencyName]);
};

/**
 * 备份助记词
 * @param passwd 密码 
 */
export const callBackupMnemonic = (passwd:string,needFragments:boolean = true) => {
    return vmRpcCall('callBackupMnemonic',[passwd,needFragments]);
};

/**
 * 修改密码
 */
export const callPasswordChange = (secretHash: string, newPsw: string) => {
    return vmRpcCall('callPasswordChange',[secretHash,newPsw]);
};

/**
 * 获取矿工费
 */
export const callFetchMinerFeeList = (currencyName:string) => {
    return vmRpcCall('callFetchMinerFeeList',[currencyName]);
};

// 获取gasPrice
export const callFetchGasPrice = (minerFeeLevel: MinerFeeLevel) => {
    return vmRpcCall('callFetchGasPrice',[minerFeeLevel]);
};

/**
 * 获取某个地址的交易记录
 */
export const callFetchTransactionList = (addr:string,currencyName:string) => {
    return vmRpcCall('callFetchTransactionList',[addr,currencyName]);
};

// 根据hash获取助记词
export const callGetMnemonicByHash = (hash:string) => {
    return vmRpcCall('callGetMnemonicByHash',[hash]);
};

/**
 * 增加或者删除展示的币种
 */
export const callUpdateShowCurrencys = (currencyName:string,added:boolean) => {
    return vmRpcCall('callUpdateShowCurrencys',[currencyName,added]);
};

/**
 * 普通转账
 */
export const callTransfer = (psw:string,txPayload:TxPayload) => {
    return vmRpcCall('callTransfer',[psw,txPayload]);
};

/**
 * 判断助记词是否合法
 */
export const callisValidMnemonic = (language: LANGUAGE, mnemonic: string) => {
    return vmRpcCall('callisValidMnemonic',[language, mnemonic]);
};

// 导出以太坊私钥
export const callExportETHPrivateKey = (mnemonic:string,addrs: AddrInfo[]) => {
    return vmRpcCall('callExportETHPrivateKey',[mnemonic, addrs]);
};

 // 导出BTC私钥
export const callExportBTCPrivateKey = (mnemonic:string,addrs: AddrInfo[]) => {
    return vmRpcCall('callExportBTCPrivateKey',[mnemonic, addrs]);
};

// 导出ERC20私钥
export const callExportERC20TokenPrivateKey = (mnemonic:string,addrs: AddrInfo[],currencyName:string) => {
    return vmRpcCall('callExportERC20TokenPrivateKey',[mnemonic, addrs,currencyName]);
};

/**
 * btc充值
 */
export const callBtcRecharge = (psw:string,txRecord:TxHistory) => {
    return vmRpcCall('callBtcRecharge',[psw,txRecord]);
};

/**
 * eth充值
 */
export const callEthRecharge = (psw:string,txRecord:TxHistory) => {
    return vmRpcCall('callEthRecharge',[psw,txRecord]);
};

/**
 * btc重发充值
 */
export const callResendBtcRecharge = (psw:string,txRecord:TxHistory) => {
    return vmRpcCall('callResendBtcRecharge',[psw,txRecord]);
};

// eth提现
export const callEthWithdraw = (secretHash:string,toAddr:string,amount:number | string) => {
    return vmRpcCall('callEthWithdraw',[secretHash,toAddr,amount]);
};

// btc提现
export const callBtcWithdraw = (secretHash:string,toAddr:string,amount:number | string) => {
    return vmRpcCall('callBtcWithdraw',[secretHash,toAddr,amount]);
};

/**
 * 获取钱包地址的位置
 */
export const callGetWltAddrIndex = (addr: string, currencyName: string) => {
    return vmRpcCall('callGetWltAddrIndex',[addr,currencyName]);
};

/**
 * 处理ETH转账
 */
export const callDoEthTransfer = (psw:string,addrIndex:number,txRecord:TxHistory) => {
    return vmRpcCall('callDoEthTransfer',[psw,addrIndex,txRecord]);
};

/**
 * btc重发
 */
export const callResendBtcTransfer = (psw:string,addrIndex:number,txRecord:TxHistory) => {
    return vmRpcCall('callResendBtcTransfer',[psw,addrIndex,txRecord]);
};

/**
 * 处理eth代币转账
 */
export const callDoERC20TokenTransfer = (psw:string,addrIndex:number, txRecord:TxHistory) => {
    return vmRpcCall('callDoERC20TokenTransfer',[psw,addrIndex,txRecord]);
};

/**
 * 图片创建或者导入的时候提前计算hash
 * @param imagePsw 图片密码
 * @param ahash ahash
 */
export const callPreCalAhashToArgon2Hash = (ahash: string, imagePsw: string) => {
    return vmRpcCall('callPreCalAhashToArgon2Hash',[ahash,imagePsw]);
};

// 锁屏密码hash算法
export const callLockScreenHash = (psw:string) => {
    return vmRpcCall('callLockScreenHash',[psw]);
};

// 锁屏密码验证
export const callLockScreenVerify = (psw:string) => {
    return vmRpcCall('callLockScreenVerify',[psw]);
};

// ===========================================wallet相关===================================================================

// ==================================recharge相关=========================================

/**
 * 去充值页面
 */
export const callGoRecharge = (balance:number,muchNeed:number) => {
    return vmRpcCall('callGoRecharge',[balance,muchNeed]);
};

// ==================================recharge相关=========================================

// ==================================reload相关=========================================

/**
 * reload success
 */
export const callEmitWebviewReload = () => {
    return vmRpcCall('callEmitWebviewReload',[]);
};

// ==================================reload相关=========================================

/**
 * rpc通信耗时测试
 */
export const callRpcTimeingTest = () => {
    return vmRpcCall('callRpcTimeingTest',[]);
};
