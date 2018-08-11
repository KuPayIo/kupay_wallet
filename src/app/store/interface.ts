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
 * 红包详情对象
 */
export interface RedEnvelope {
    // tslint:disable-next-line:no-reserved-keywords
    type: string;
    time: string;
    currencyName: string;
    amount: number;
    leaveMessage: string;
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
    accountDetail: Map<CurrencyType, number>;// 云端账户详情
}