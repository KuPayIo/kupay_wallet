/**
 * @file store
 * @author donghr
 */
// ============================================ 导入
import { HandlerMap } from '../../pi/util/event';
import { cryptoRandomInt } from '../../pi/util/math';
import { depCopy, fetchDefaultExchangeRateJson, getFirstEthAddr } from '../utils/tools';
// tslint:disable-next-line:max-line-length
import { AccountDetail,AddMineItem, Addr, CHisRec, CurrencyType, DividendItem, DividTotal, LockScreen, LoginState, MarketInfo, MineRank, MiningRank, MiningTotal, Product, PurchaseRecordOne, RechargeWithdrawalLog,ShapeShiftCoin, ShapeShiftTx, ShapeShiftTxs, SHisRec, Store, TopContact, TransactionRecord, Wallet } from './interface';

// ============================================ 导出
/**
 * 根据keyName返回相应的数据，map数据会被转换为数组
 * 若传入id参数,则会取相应map的值
 */
// tslint:disable-next-line:no-any
export const find = (keyName: KeyName, id?: number | string): any => {
    if (!id) {
        const value = store[keyName];
        if (!(value instanceof Map)) {
            return value instanceof Object ? depCopy(value) : value;
        }
        const arr = [];
        for (const [, v] of value) {
            arr.push(v);
        }

        return depCopy(arr);
    }
    const value = store[keyName].get(id);
    if (value instanceof Map) {
        const result = value.get(id);

        return result && depCopy(result);
    } else {
        return value && depCopy(value);
    }
};

/**
 * 返回原始数据结构
 */
export const getBorn = (keyname) => {
    return store[keyname];
};

/**
 * 更新store并通知
 */
// tslint:disable-next-line:no-any
export const updateStore = (keyName: KeyName, data: any, notified: boolean = true): void => {
    store[keyName] = data;
    if (notified) handlerMap.notify(keyName, [data]);
};

/**
 * 更新store---后续考虑移除
 */
export const notify = (keyName: KeyName, data?: any) => {
    handlerMap.notify(keyName, [data]);
};
/**
 * 消息处理器
 */
export const register = (keyName: KeyName, cb: Function): void => {
    handlerMap.add(keyName, <any>cb);
};

export const unregister = (keyName: KeyName, cb: Function): void => {
    handlerMap.remove(keyName, <any>cb);
};
/**
 * 初始化store
 */
export const initStore = () => {
    // 从localStorage中取wallets
    const wallets = findByLoc('wallets');
    store.walletList = (wallets && wallets.walletList) || [];
    // 从localStorage中取addrs
    store.addrs = findByLoc('addrs') || [];
    // 从localStorage中取transactions
    store.transactions = findByLoc('transactions') || [];
    // 从localStorage中的wallets中初始化salt
    store.salt = (wallets && wallets.salt) || cryptoRandomInt().toString();
    // 从localStorage中的wallets中初始化curWallet
    store.curWallet = wallets && wallets.walletList.length > 0 && wallets.walletList.filter(v => v.walletId === wallets.curWalletId)[0];
    // 从localStorage中取readedPriAgr
    store.readedPriAgr = findByLoc('readedPriAgr');
    // 从localStorage中取lockScreen
    store.lockScreen = findByLoc('lockScreen') || {};
    store.ERC20TokenDecimals = findByLoc('ERC20TokenDecimals') || {};
    // 从localStorage中取sHisRecMap
    const sHisRecMap = new Map<string,SHisRec>(findByLoc('sHisRecMap'));
    store.sHisRec = sHisRecMap.get(getFirstEthAddr());
    // 从localStorage中取cHisRecMap
    const cHisRecMap = new Map<string,CHisRec>(findByLoc('cHisRecMap'));
    store.cHisRec = cHisRecMap.get(getFirstEthAddr());
    // 从localStorage中取inviteRedBagRecMap
    const inviteRedBagRecMap = new Map<string,CHisRec>(findByLoc('inviteRedBagRecMap'));
    store.inviteRedBagRec = inviteRedBagRecMap.get(getFirstEthAddr());
   // 从localStorage中取inviteRedBagRecMap
    store.shapeShiftTxsMap = new Map(findByLoc('shapeShiftTxsMap'));
    // 从localStorage中取常用联系人列表
    store.TopContacts = findByLoc('TopContacts') || [];
    // 从localStorage中取nonceMap
    store.nonceMap = new Map<string,number>(findByLoc('nonceMap'));
    // 从localStorage中取realUserMap
    store.realUserMap = new Map<string,boolean>(findByLoc('realUserMap'));

    // 初始化默认兑换汇率列表
    store.exchangeRateJson = fetchDefaultExchangeRateJson();

};

// tslint:disable-next-line:max-line-length
type KeyName = MapName | LocKeyName | shapeShiftName | loadingEventName | 'walletList' | 'curWallet' | 'addrs' | 'salt' | 'transactions' | 'cloudBalance' | 'conUser' | 
'conUserPublicKey' | 'conRandom' | 'conUid' | 'loginState' | 'miningTotal' | 'miningHistory' | 'mineItemJump' |
'dividHistory' | 'accountDetail' | 'dividTotal' | 'addMine' | 'mineRank' | 'miningRank' | 'sHisRec' | 'cHisRec' |
 'inviteRedBagRec' | 'rechargeLogs' | 'withdrawLogs' | 'productList' | 'purchaseRecord'| 'gasPrice' | 'userInfo' | 'coinGain';

type MapName = 'exchangeRateJson' | 'hashMap';

type shapeShiftName = 'shapeShiftCoins' | 'shapeShiftMarketInfo' | 'shapeShiftTxs';

type loadingEventName = 'level_1_page_loaded' | 'level_2_page_loaded' | 'level_3_page_loaded';
// ============================================ 本地
type LocKeyName = 'wallets' | 'addrs' | 'transactions' | 'readedPriAgr' | 'lockScreen' | 'sHisRecMap' | 'cHisRecMap' |
 'inviteRedBagRecMap' | 'shapeShiftTxsMap' | 'TopContacts' | 'ERC20TokenDecimals' | 'lastGetSmsCodeTime' | 'nonceMap'|
 'realUserMap';
const findByLoc = (keyName: LocKeyName): any => {
    const value = JSON.parse(localStorage.getItem(keyName));

    return value instanceof Object ? depCopy(value) : value;
};

// ============================================ 立即执行
/**
 * 消息处理列表
 */
const handlerMap: HandlerMap = new HandlerMap();

// tslint:disable-next-line:no-object-literal-type-assertion
const store = <Store>{
    // 基础数据
    hashMap: new Map<string, string>(),// 输入密码后hash缓存
    salt: '',// 盐--加密时使用
    conUser: '',// 连接用户
    conUserPublicKey: '',// 连接用户公钥
    conRandom: '',// 连接随机数
    conUid: 0,// 连接uid
    userInfo:null,// 用户头像base64
    readedPriAgr: false, // 是否阅读隐私协议
    loginState: LoginState.init,// 连接状态
    coinGain:new Map<string,number>(),
    // 本地钱包
    walletList: <Wallet[]>[],// 钱包数据
    curWallet: <Wallet>null,// 当前钱包
    addrs: <Addr[]>[],// 地址数据
    transactions: <TransactionRecord[]>[],// 交易记录
    exchangeRateJson: new Map<string, any>(),// 兑换汇率列表
    ERC20TokenDecimals:null,// ERC20精度
    lockScreen: <LockScreen>null, // 锁屏密码相关
    nonceMap:new Map<string,number>(),// 本地nonce维护
    gasPrice:{},// gasPrice分档次
    realUserMap:new Map<string,boolean>(),// 本地真实用户map
    // 云端数据
    cloudBalance: new Map<CurrencyType, number>(),// 云端账户余额
    accountDetail: new Map<CurrencyType, AccountDetail[]>(),// 云端账户详情
    sHisRec: <SHisRec>null, // 发送红包记录
    cHisRec: <CHisRec>null,// 兑换红包记录
    inviteRedBagRec: <CHisRec>null,// 邀请红包记录
    miningTotal: <MiningTotal>null, // 挖矿汇总信息
    dividTotal: <DividTotal>null,// 分红汇总信息
    miningHistory: <DividendItem[]>[],// 挖矿历史记录
    dividHistory: <DividendItem[]>[],// 分红历史记录
    addMine: <AddMineItem[]>[],// 矿山增加项目
    mineRank: <MineRank>null,// 矿山排名
    miningRank: <MiningRank>null,// 挖矿排名
    mineItemJump: '',// 矿山增加项目跳转详情
    rechargeLogs:new Map<CurrencyType, RechargeWithdrawalLog[]>(),// 充值记录
    withdrawLogs:new Map<CurrencyType, RechargeWithdrawalLog[]>(),// 提现记录
    // shapeshift
    shapeShiftCoins: <ShapeShiftCoin[]>[],// shapeShift 支持的币种
    shapeShiftMarketInfo:<MarketInfo>null,// shapeshift 汇率相关
    shapeShiftTxs:<ShapeShiftTxs>null,// shapeshift 交易记录
    shapeShiftTxsMap:new Map<string,ShapeShiftTxs>(),// shapeshift 交易记录Map
    // 地址管理
    TopContacts: <TopContact[]>[],// 常用联系人列表 
    // 理财
    // 所有理财产品
    productList:  <Product[]>[],
    // 已购买理财产品
    purchaseRecord:<PurchaseRecordOne[]>[],
    lastGetSmsCodeTime:0
};
