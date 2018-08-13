/**
 * 内存中的数据结构
 */

// 枚举登录状态
export enum LoginState {
    init = 0,
    logining,
    logined,
    relogining,
    logouting,
    logouted,
    logerror
}
// 货币类型
export enum CurrencyType {
    KT = 100,
    ETH
}

// 枚举货币类型
export const CurrencyTypeReverse = {
    100: 'KT',
    101: 'ETH'
};

// 红包类型
export enum RedEnvelopeType {
    Normal = '00',
    Random = '01',
    Invite = '99'
}

/**
 * localstorage wallet object
 */
export interface WalletInfo {
    curWalletId: string;  // wallet id  (first address)
    salt: string;
    walletList: Wallet[];
}

/**
 * localstorage wallet object
 */
export interface Wallet {
    walletId: string;  // wallet id  (first address)
    avatar: string;
    walletPswTips?: string;// wallet password tips
    gwlt: string;  // Serialization EthWallet object
    showCurrencys: string[]; // home page show currencys
    currencyRecords: CurrencyRecord[];
}

/**
 * 货币记录
 */
export interface CurrencyRecord {
    currencyName: string; // currency Name 
    currentAddr: string;// current address
    addrs: string[];// address list
    updateAddr: boolean;
}

/**
 * 货币信息
 */
export interface CurrencyInfo {
    name: string;
    description: string;
}

/**
 * 地址对象
 */
export interface Addr {
    addr: string;// 地址
    addrName: string;// 地址名
    balance: number;// 余额
    currencyName: string;// 货币类型
    record: any[];// 记录缓存
}

/**
 * 交易记录
 */
export interface TransactionRecord {
    addr: string;// 地址
    currencyName: string;// 货币类型
    fees: number;// 矿工费
    hash: number;// 交易hash
    info: string;// 描述
    time: number;// 时间
    value: number;// 交易量
    inputs?: string[];// 输入地址列表
    outputs?: string[];// 输出地址列表
}
/**
 * 锁屏密码相关
 */
export interface LockScreen {
    psw?:string;// 锁屏密码
    open?:boolean;// 锁屏功能是否打开
    jump?:boolean;// 创建钱包后是否跳过锁屏设置,如果跳过,再次创建钱包时默认不再跳出锁屏设置
    locked?:boolean;// 是否3次解锁机会都用完
}

// 任务id记录
export enum TaskSid {
    createWlt = 1001,// 创建钱包
    firstChargeEth,// 首次转入
    bindPhone,// 注册手机
    chargeEth,// 存币
    inviteFriends,// 邀请真实好友
    buyFinancial = 1007,// 购买理财产品
    transfer,// 交易奖励
    bonus,// 分红
    mines,// 挖矿
    chat,// 聊天
    redEnvelope = 'red_bag_port' // 红包
}

export interface AccountDetail {
    iType: TaskSid;// 类型
    amount: number;// 数据
    behavior: string;// 标签
    time: number;// 时间
}

/**
 * 发送红包记录
 */
export interface SHisRec {
    sendNumber:number;// 发送红包总数
    start:string;// 翻页start
    list:SRecDetail[];// 详情列表
}
/**
 * 发送红包记录详情
 */
export interface SRecDetail {
    rid:string;// 红包id
    rtype:number;// 红包类型
    ctype:number;// 币种
    ctypeShow:string;
    amount:number;// 金额
    time:number;// 时间
    timeShow:string;
    codes:string[];// 兑换码
}

/**
 * 兑换红包记录
 */
export interface CHisRec {
    convertNumber:number;// 兑换红包总数
    start:string;// 翻页start
    list:CRecDetail[];// 详情列表
}
/**
 * 兑换红包记录详情
 */
export interface CRecDetail {
    suid: number;// 发送者uid
    rid: number;// 红包id
    rtype: number;// 红包类型 0-普通红包，1-拼手气红包，99-邀请红包
    rtypeShow:string;
    ctype: number;// 币种
    ctypeShow:string;
    amount: number;// 金额
    time: number;// 时间
    timeShow:string;
}
/**
 * 红包详情
 */
export interface RedBag {
    suid:number;// 发送者uid
    cuid:number; // 兑换者uid
    rtype:number;// 红包类型
    ctype:number;// 货币类型
    amount:number;// 金额
    time:number;// 时间
    timeShow:string;
}
export interface Store {
    // 基础数据
    hashMap: Map<string, string>;// 输入密码后hash缓存
    salt: string;// 盐--加密时使用
    conUser: string;// 连接用户
    conUserPublicKey: string;// 连接用户公钥
    conRandom: string;// 连接随机数
    conUid: number;// 连接uid
    readedPriAgr: boolean;// 隐私协议阅读与否
    loginState: LoginState;// 连接状态
    lockScreen:LockScreen;// 锁屏相关
    // 本地钱包
    walletList: Wallet[];// 钱包数据
    curWallet: Wallet;// 当前钱包
    addrs: Addr[];// 地址数据
    transactions: TransactionRecord[];// 交易记录
    exchangeRateJson: Map<string, any>;// 兑换汇率列表
    currencyList: CurrencyInfo[];// 货币信息列表
    shapeShiftCoins: any;// shapeShift 支持的币种
    // 云端数据
    cloudBalance: Map<CurrencyType, number>;// 云端账户余额
    accountDetail: Map<CurrencyType, AccountDetail[]>;// 云端账户详情
    sHisRec:SHisRec;// 发送红包记录
    cHisRec:CHisRec;// 兑换红包记录

}