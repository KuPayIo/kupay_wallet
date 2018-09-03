import { config } from '../core/config';

/**
 * 一些常用常量
 */

// 钱包数量最大限制
export const walletNumLimit = 10;
// 分页每页条目数量
export const PAGELIMIT = 10;
// 钱包所支持的货币列表测试网络
const supportCurrencyListTest = [
    { name: 'ETH', description: 'Ethereum' },
    { name: 'BTC', description: 'Bit coin' },
    { name: 'BNB', description: 'BNB' },
    { name: 'VEN', description: 'VeChain' },
    { name: 'OMG', description: 'OmiseGO' },
    { name: 'ZRX', description: 'ZRX' },
    { name: 'MKR', description: 'Maker' },
    { name: 'BAT', description: 'BAT' },
    { name: 'XUC', description: 'ExchangeUnion' },
    { name: 'REP', description: 'Reputation' },
    { name: 'BTM', description: 'Bytom' },
    { name: 'USDT', description: 'Tether USD' },
    { name: 'PPT', description: 'Populous' },
    { name: 'SNT', description: 'StatusNetwork' },
    { name: 'AION', description: 'AION' },
    { name: 'FUN', description: 'FunFair' },
    { name: 'KNC', description: 'KyberNetwork' },
    { name: 'POWR', description: 'PowerLedger' },
    { name: 'MANA', description: 'Decentraland' },
    { name: 'KIN', description: 'Kin' }
];
// 钱包所支持的货币列表主网络
const supportCurrencyListMain = [
    { name: 'ETH', description: 'Ethereum' },
    { name: 'BTC', description: 'Bit coin' },
    { name: 'BNB', description: 'BNB' },
    { name: 'VEN', description: 'VeChain' },
    { name: 'OMG', description: 'OmiseGO' },
    { name: 'ZRX', description: 'ZRX' },
    { name: 'MKR', description: 'Maker' },
    { name: 'BAT', description: 'BAT' },
    { name: 'XUC', description: 'ExchangeUnion' },
    { name: 'REP', description: 'Reputation' },
    { name: 'BTM', description: 'Bytom' },
    { name: 'GNT', description: 'Golem' },
    { name: 'PPT', description: 'Populous' },
    { name: 'SNT', description: 'StatusNetwork' },
    { name: 'AION', description: 'AION' },
    { name: 'FUN', description: 'FunFair' },
    { name: 'KNC', description: 'KyberNetwork' },
    { name: 'MCO', description: 'Monaco' },
    { name: 'POWR', description: 'PowerLedger' },
    { name: 'MANA', description: 'Decentraland' },
    { name: 'KIN', description: 'Kin' },
    { name: 'VERI', description: 'Veritaseum' }
];
// 默认货币汇率测试网络
const defaultExchangeRateJsonTest = {
    ETH: { CNY: 3337.01, USD: 517.42 },
    BTC: { CNY: 42868.55, USD: 6598.71 },
    KT: { CNY:0.03,USD:0.19 },
    BNB: { CNY: 1, USD: 1 },
    VEN: { CNY: 1, USD: 1 },
    OMG: { CNY: 1, USD: 1 },
    ZRX: { CNY: 1, USD: 1 },
    MKR: { CNY: 1, USD: 1 },
    BAT: { CNY: 1, USD: 1 },
    XUC: { CNY: 1, USD: 1 },
    REP: { CNY: 1, USD: 1 },
    BTM: { CNY: 1, USD: 1 },
    USDT: { CNY: 1, USD: 1 },
    PPT: { CNY: 1, USD: 1 },
    SNT: { CNY: 1, USD: 1 },
    AION: { CNY: 1, USD: 1 },
    FUN: { CNY: 1, USD: 1 },
    KNC: { CNY: 1, USD: 1 },
    POWR: { CNY: 1, USD: 1 },
    MANA: { CNY: 1, USD: 1 },
    KIN: { CNY: 1, USD: 1 }
};

// 默认货币汇率主网络
const defaultExchangeRateJsonMain = {
    ETH: { CNY: 3337.01, USD: 517.42 },
    BTC: { CNY: 42868.55, USD: 6598.71 },
    KT: { CNY:0.03,USD:0.19 },
    BNB: { CNY: 1, USD: 1 },
    VEN: { CNY: 1, USD: 1 },
    OMG: { CNY: 1, USD: 1 },
    ZRX: { CNY: 1, USD: 1 },
    MKR: { CNY: 1, USD: 1 },
    BAT: { CNY: 1, USD: 1 },
    XUC: { CNY: 1, USD: 1 },
    REP: { CNY: 1, USD: 1 },
    BTM: { CNY: 1, USD: 1 },
    GNT: { CNY: 1, USD: 1 },
    PPT: { CNY: 1, USD: 1 },
    SNT: { CNY: 1, USD: 1 },
    AION: { CNY: 1, USD: 1 },
    FUN: { CNY: 1, USD: 1 },
    KNC: { CNY: 1, USD: 1 },
    MCO: { CNY: 1, USD: 1 },
    POWR: { CNY: 1, USD: 1 },
    MANA: { CNY: 1, USD: 1 },
    KIN: { CNY: 1, USD: 1 },
    VERI: { CNY: 1, USD: 1 }
};

// 测试网络ERC20代币精度
const ERC20TokenDecimalsTest = {
    BNB: 100000000,
    VEN: 100000000,
    OMG: 100000000,
    ZRX: 100000000,
    MKR: 100000000,
    BAT: 100000000,
    XUC: 100000000,
    REP: 100000000,
    BTM: 100000000,
    USDT: 100000000,
    PPT: 100000000,
    SNT: 100000000,
    AION: 100000000,
    FUN: 100000000,
    KNC: 100000000,
    POWR: 100000000,
    MANA: 100000000,
    KIN: 100000000
};

// 主网络ERC20代币精度
const ERC20TokenDecimalsMain = {
    BNB: 1000000000000000000,
    VEN: 1000000000000000000,
    OMG: 1000000000000000000,
    ZRX: 1000000000000000000,
    MKR: 1000000000000000000,
    BAT: 1000000000000000000,
    XUC: 1000000000000000000,
    REP: 1000000000000000000,
    BTM: 100000000,
    GNT: 1000000000000000000,
    PPT: 100000000,
    SNT: 1000000000000000000,
    AION: 100000000,
    FUN: 100000000,
    KNC: 1000000000000000000,
    MCO: 100000000,
    POWR: 1000000,
    MANA: 1000000000000000000,
    KIN: 1000000000000000000,
    VERI:1000000000000000000
};
// 默认货币汇率
export const defaultExchangeRateJson = (config.dev_mode === 'dev') ? defaultExchangeRateJsonTest : defaultExchangeRateJsonMain;

// ERC20代币精度
export const ERC20TokenDecimals = (config.dev_mode === 'dev') ? ERC20TokenDecimalsTest : ERC20TokenDecimalsMain;

// 默认显示得ETH代币
export const defaultEthToken = [];

// 默认显示货币列表
export const defalutShowCurrencys = ['ETH', 'BTC'];

//
export const strength = 128;

// todo 测试网络与正式网络切换
// btc网络
export const btcNetwork = config.dev_mode === 'dev' ? 'testnet' : 'mainnet';

// 语言
export const lang = 'english';

// eth代币transfer交易编码前缀
export const ethTokenTransferCode = '0xa9059cbb';

// 导航页广告
export const guidePages = [
    { imgUrl: 'img_security1.png', text: '' },
    { imgUrl: 'img_security2.png', text: '' },
    { imgUrl: 'img_security3.png', text: '' }
];

// 锁屏密码盐值
export const lockScreenSalt = 'salt';

// shapeshift api public key
// tslint:disable-next-line:max-line-length
export const shapeshiftApiPublicKey = '339a363550d4490fb4a0efae308440f4386c7d99ecf0f572584adc0400658b5799e3107eb0fe573c438e6d98b68dbe2ade2873aa7ac2fde8f74ab1be0750fdb2';

// shapeshift api private key
// tslint:disable-next-line:max-line-length
export const shapeshiftApiPrivateKey = 'c98210f4568b04d3f84c5404f8e5be98353849138ed26b3e2723223257d3cbb8bb5cba5060b7c4d44e746342a2eb43e26b9bb5827588d9ed3e712e85d35f054c';

// 如果shapeshift交易记录返回[],请求的最多次数,超过默认没有交易记录
export const shapeshiftTransactionRequestNumber = 5;
// 发红包所支持的货币
export const redEnvelopeSupportCurrency = ['KT', 'ETH'];

// 提现服务费比率
export const withdrawServiceCharge = 1.03;

// 默认ETH gasLimit
export const defaultGasLimit = 21000;

// 重发时间间隔(超过间隔还未成功即可重发)
export const resendInterval = 3 * 1000;

// 最小提现金额
export const withdrawLimit = {
    KT:1000,
    ETH:0.01,
    BTC:0.001
};