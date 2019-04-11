import { TaskSid } from './parse';

/**
 * 内存中的数据结构
 */

/**
 * 全局store数据
 */
export interface Store {
    user: User;          // 账号
    wallet: Wallet;      // 钱包
    cloud: Cloud;        // 云端
    activity: Activity;  // 活动：红包，挖矿，分成，理财

    setting: Setting;     // 设置

    third: Third;        // 第三方通信数据，如：changelly...
    flags: object;       // 全局的标识
    inviteUsers:object;  // 邀请好友
}

/**
 * 云端账户的货币类型
 */
export enum CloudCurrencyType {
    KT = 100,  // KT
    ETH,       // ETH 
    BTC,       // BTC
    ST,         // ST
    SC         // SC 银两
}

/**
 * 红包类型
 */
export enum LuckyMoneyType {
    Normal = '00',   // 等额红包
    Random = '01',   // 随机红包
    Invite = '99'    // 邀请码
}

/**
 * 交易状态
 */
export enum TxStatus {
    Pending,     // 打包中
    Confirmed,   // 确认 >= 1个区块确认
    Failed,      // 失败
    Success      // 成功  一定的区块确认后认为succss
}

/**
 * 交易类型
 */
export enum TxType {
    Transfer = 1,    // 普通转账
    Receipt,         // 收款
    Recharge,        // 充值
    Exchange         // 币币兑换
}

/**
 * 当前用户数据
 */
export interface User {

    id: string;            // 该账号的id,实际上是第一个以太坊地址

    offline: boolean;       // 连接状态
    isLogin: boolean;      // 钱包登录状态
    allIsLogin:boolean;     // 所有服务登录状态  (钱包  活动  聊天)

    token: string;         // 自动登录token
    conRandom: string;     // 连接随机数
    conUid: string;        // 服务器连接uid
    publicKey: string;     // 用户公钥, 第一个以太坊地址的公钥

    salt: string;          // 加密 盐值

    info: UserInfo;        // 基本信息
}

/**
 * 当前用户前端数据
 */
export interface Cloud {
    cloudWallets: Map<CloudCurrencyType, CloudWallet>;     // 云端钱包相关数据, 余额  充值提现记录...
}

/**
 * 第三方通信数据，如：shapeshift...
 */
export interface Third {
    gasPrice: GasPrice;                // gasPrice分档次
    btcMinerFee: BtcMinerFee;          // btc minerfee 分档次
    gasLimitMap: Map<string, number>;  // 各种货币转账需要的gasLimit

    // changelly
    changellyCurrencies: string[];            // changelly 支持的币种

    rate: number;                                 // 货币的美元汇率
    silver:Silver;                                // 白银价格
    currency2USDTMap: Map<string, Currency2USDT>;  // k线  --> 计算涨跌幅
}

/**
 * 用户设置
 */
export interface Setting {
    lockScreen: LockScreen;       // 锁屏
    language: string;             // 语言
    changeColor: string;          // 涨跌颜色设置，默认：红跌绿张
    currencyUnit: string;         // 显示哪个国家的货币
    deviceId:string;              // 设备唯一id
    deviceInfo:any;               // 设备信息 
    topHeight:number;             // 设备头部应空出来的高度(刘海高度)
    bottomHeight:number;          // 设备底部应空出来的高度
}

/**
 *  changelly 交易记录的changelly方收币地址
 */
export interface ChangellyPayinAddr {
    currencyName:string;   // 出币
    payinAddress:string;   // changelly收币地址
}

/**
 * changelly 临时交易记录
 */
export interface ChangellyTempTxs {
    hash:string;   // 交易hash
    id:string;    // 交易id
}
/**
 * 红包模块
 */
export interface LuckyMoney {
    sends: LuckyMoneySendHistory;          // 发送红包记录
    exchange: LuckyMoneyExchangeHistory;   // 兑换红包记录
    invite: LuckyMoneyExchangeHistory;     // 邀请码记录
}

/**
 * 挖矿模块
 */
export interface Mining {
    total: MiningTotal;       // 挖矿汇总信息
    history: DividendHistory; // 挖矿历史记录
    addMine: AddMineItem[];   // 矿山增加项目
    mineRank: MineRank;       // 矿山排名
    miningRank: MiningRank;   // 挖矿排名
    itemJump: string;         // 矿山增加项目跳转详情
}

/**
 * 分红模块
 */
export interface Dividend {
    total: DividendTotal;         // 分红汇总信息
    history: DividendHistory;     // 分红历史记录
}

/**
 * 理财模块
 */
export interface FinancialManagement {
    products: Product[];                  // 所有理财产品
    purchaseHistories: PurchaseHistory[]; // 已购买理财产品
}

/**
 * 活动
 */
export interface Activity {
    luckyMoney: LuckyMoney;                   // 红包
    mining: Mining;                           // 挖矿
    dividend: Dividend;                       // 分红
    financialManagement: FinancialManagement; // 理财
}

/**
 * 云端钱包
 */
export interface CloudWallet {
    balance: number;   // 余额
    rechargeLogs: {    // 充值记录
        list: RechargeWithdrawalLog[];
        start: number;
        canLoadMore: boolean;
    };
    withdrawLogs: {    // 提现记录
        list: RechargeWithdrawalLog[];
        start: number;
        canLoadMore: boolean;
    };
    otherLogs: {       // 云端流水详情
        list: OtherLogs[];
        start: number;
        canLoadMore: boolean;
    };
}

/**
 * 货币对标USDT k线
 */
export interface Currency2USDT {
    open: number;  // 开盘价
    close: number; // 收盘价
}

/**
 * 云端用户基础数据
 */
export interface UserInfo {
    nickName: string;      // 昵称
    avatar: string;        // 头像
    phoneNumber: string;   // 手机号
    areaCode:string;     // 手机区号
    isRealUser: boolean;    // 是否是真实用户
    acc_id:string;  // 账户ID 钱包，聊天，活动统一账号
}

/**
 * 钱包对象
 */
export interface Wallet {
    vault: string;                      // 钱包核心
    setPsw:boolean;                     // 是否已经设置过密码
    isBackup: boolean;                  // 备份助记词与否
    sharePart:boolean;                  // 是否有通过分享片段备份
    helpWord:boolean;                   // 是否通过助计词备份
    showCurrencys: string[];            // 显示的货币列表
    currencyRecords: CurrencyRecord[];  // 支持的所有货币记录
    changellyPayinAddress:ChangellyPayinAddr[];           // changelly 交易记录的changelly方收币地址
    changellyTempTxs:ChangellyTempTxs[];   // changelly 临时交易记录
    logoutTimestamp?:number;             // 登出时间戳
}

/**
 * 货币记录
 */
export interface CurrencyRecord {
    currencyName: string;            // 货币名称
    currentAddr: string;             // 当前正在使用的地址
    addrs: AddrInfo[];               // 所有的地址
    updateAddr: boolean;             // 地址是否已经更新
}

/**
 * 地址对象
 */
export interface AddrInfo {
    addr: string;                    // 地址
    balance: number;                 // 余额
    txHistory: TxHistory[];          // 交易记录
    nonce?: number;                  // 本地维护的nonce(对BTC无效)
}

/**
 * 本地缓存交易记录
 */
export interface TxHistory {
    hash: string;                       // 交易hash
    addr: string;                       // 哪个地址的交易
    txType: TxType;                     // 交易类型 1 转账 2 收款 3 充值 4 币币兑换转账
    fromAddr: string;                   // 转账地址
    toAddr: string;                     // 收币地址
    pay: number;                        // 转账金额
    time: number;                       // 时间戳
    status: TxStatus;                   // 交易状态
    confirmedBlockNumber: number;       // 已确认区块数
    needConfirmedBlockNumber: number;   // 需要确认得区块数
    info: string;                       // 交易额外信息
    currencyName: string;               // 货币名称
    fee: number;                        // 矿工费
    nonce: number;                      // nonce
    minerFeeLevel?: MinerFeeLevel;      // 矿工费档次
}

/**
 * 矿工费3档次
 */
export enum MinerFeeLevel {
    Standard,         // 标准
    Fast,             // 快
    Fastest           // 最快
}
/**
 * 每个档次的gas价格
 */
export interface GasPrice {
    [MinerFeeLevel.Standard]: number;  // 标准
    [MinerFeeLevel.Fast]: number;      // 快
    [MinerFeeLevel.Fastest]: number;    // 最快
}

/**
 * 每个档次的btc矿工费
 */
export interface BtcMinerFee {
    [MinerFeeLevel.Standard]: number;       // 标准
    [MinerFeeLevel.Fast]: number;           // 快
    [MinerFeeLevel.Fastest]: number;         // 最快
}

/**
 * 挖矿汇总信息
 */
export interface MiningTotal {
    totalNum: number; // 矿山总量
    thisNum: number;  // 本次可挖
    holdNum: number;  // 已挖数量
}

/**
 * 分红信息
 */
export interface DividendTotal {
    total: number;      // 累计分红
    thisDivid: number;  // 本次分红
    totalDays: number;  // 分红天数
    yearIncome: number; // 年华收益
}

/**
 * 挖矿，分红历史记录单项
 */
export interface DividendItem {
    num: number;
    time: string;
    total: number;
}

/**
 * 挖矿，分红历史记录
 */
export interface DividendHistory {
    list: DividendItem[];
    start: number;
    canLoadMore: boolean;
}

/**
 * 矿山增加项目
 */
export interface AddMineItem {
    isComplete: boolean;  // 是否已完成该挖矿步骤
    itemNum: number;      // 该项目已得到数量
}

/**
 * 矿山，挖矿排名单项
 */
export interface MineRankItem {
    index: number;         // 名次
    name: string;          // 用户名称
    num: number;           // 矿山，挖矿总量
}

/**
 * 矿山排名
 */
export interface MineRank {
    page: number;            // 矿山排名列表页码
    isMore: boolean;         // 矿山排名是否还有更多  
    rank: MineRankItem[];    // 矿山排名分页数据
    myRank: number;          // 当前用户的排名
}

/**
 * 挖矿排名
 */
export interface MiningRank {
    page: number;            // 挖矿排名列表页码
    isMore: boolean;         // 挖矿排名是否还有更多  
    rank: MineRankItem[];    // 挖矿排名分页数据
    myRank: number;          // 当前用户的排名
}

/**
 * 发送红包记录
 */
export interface LuckyMoneySendHistory {
    sendNumber: number;            // 发送红包总数
    start: string;                 // 翻页start
    list: LuckyMoneySendDetail[];  // 详情列表
}
/**
 * 发送红包记录详情
 */
export interface LuckyMoneySendDetail {
    rid: string;                // 红包id
    rtype: number;              // 红包类型
    ctype: number;              // 币种
    ctypeShow: string;          // 币种显示格式
    amount: number;             // 金额
    time: number;               // 时间
    timeShow: string;           // 时间显示格式
    codes: string[];            // 兑换码
    curNum: number;             // 红包已兑换个数
    totalNum: number;            // 总个数
}

/**
 * 兑换红包记录
 */
export interface LuckyMoneyExchangeHistory {
    exchangeNumber: number;                      // 兑换红包总数
    start: string;                               // 翻页start
    list: LuckyMoneyExchangeDetail[];            // 详情列表
}
/**
 * 兑换红包记录详情
 */
export interface LuckyMoneyExchangeDetail {
    suid: number;              // 发送者uid
    rid: string;               // 红包id
    rtype: number;             // 红包类型 0-普通红包，1-拼手气红包，99-邀请码
    rtypeShow: string;
    ctype: number;             // 币种
    ctypeShow: string;
    amount: number;            // 金额
    time: number;              // 时间
    timeShow: string;
}

/**
 * 红包详情
 */
export interface LuckyMoneyDetail {
    suid: number;            // 发送者uid
    cuid: number;            // 兑换者uid
    rtype: number;           // 红包类型
    ctype: number;           // 货币类型
    amount: number;          // 金额
    time: number;            // 时间
    timeShow: string;
}

/**
 * 充值提现记录
 */
export interface RechargeWithdrawalLog {
    time: number;        // timestamp
    timeShow: string;
    amount: number;      // 金额
    status: number;      // 状态码
    statusShow: string;
    hash: string;        // 交易hash
}

/**
 * 其他流水记录
 */
export interface OtherLogs {
    iType: TaskSid;    // 类型
    amount: number;    // 数据
    behavior: string;  // 标签
    time: number;      // 时间
}

/**
 * 理财产品数据结构
 */
export interface Product {
    id: string;                     // 产品id
    title: string;                  // 标题
    profit: string;                 // 预期年化收益
    productName: string;            // 产品名称
    productDescribe: string;        // 产品描述
    unitPrice: number;              // 单价
    coinType: string;               // 购买币种
    days: string;                   // 累计天数
    total: number;                  // 总量
    surplus: number;                // 剩余数量
    purchaseDate: string;           // 起购日
    interestDate: string;           // 收益日
    endDate: string;                // 截止日
    productIntroduction: number;    //
    limit: number;                  // 限购量
    lockday: string;                // 锁定期
    isSoldOut: boolean;             // 售罄与否

}

/**
 * 理财购买记录数据结构
 */
export interface PurchaseHistory {
    id: string;                  // 产品id
    yesterdayIncoming: number;      // 昨日收益
    totalIncoming: number;          // 总收益
    profit: string;              // 预期年化收益
    productName: string;         // 产品名称
    unitPrice: number;           // 单价
    amount: number;              // 购买数量
    coinType: string;            // 购买币种
    days: string;                // 累计天数
    purchaseDate: string;        // 起购日
    interestDate: string;        // 起息日
    endDate: string;             // 结束日
    purchaseTimeStamp: string;   // 购买时间戳
    productIntroduction: number; // 产品简介
    lockday: string;             // 锁定期
    state: number;                  // 状态
}

/**
 * 锁屏密码相关
 */
export interface LockScreen {
    psw?: string;           // 锁屏密码
    open?: boolean;         // 锁屏功能是否打开
    locked?: boolean;       // 是否3次解锁机会都用完
}

/**
 * ST价格、涨跌
 */
export interface Silver {
    price:number;          // 价格
    change:number;         // 涨跌
}
