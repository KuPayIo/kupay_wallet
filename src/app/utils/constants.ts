import { config } from '../core/config';

/**
 * 一些常用常量
 */

// 钱包数量最大限制
export const walletNumLimit = 10;
// 钱包所支持的货币列表测试网络
export const supportCurrencyListTest = [
    { name: 'ETH', description: 'Ethereum' },
    { name: 'BTC', description: 'Bit coin' },
    { name: 'YNC', description: 'YiNeng Ltd' }
];
// 钱包所支持的货币列表主网络
export const supportCurrencyListMain = [
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
    { name: 'VERI', description: 'Veritaseum' },
    { name: 'HEALP', description: 'HEALP' }
];

// 钱包所支持的货币列表
export const supportCurrencyList = config.currentNetIsTest ? supportCurrencyListTest : supportCurrencyListMain;

// 默认显示得ETH代币
export const defaultEthToken = [];

// 默认显示货币列表
export const defalutShowCurrencys = ['ETH', 'BTC'];

//
export const strength = 128;

// todo 测试网络与正式网络切换
// btc网络
export const btcNetwork = 'testnet';

// 语言
export const lang = 'english';

// 默认货币汇率测试网络
export const defaultExchangeRateJsonTest = {
    ETH: { CNY: 3337.01, USD: 517.42 },
    BTC: { CNY: 42868.55, USD: 6598.71 },
    YNC: { CNY: 100, USD: 15.2625 },
    KT: { CNY: 0.03, USD: 0.19 }
};

// 默认货币汇率主网络
export const defaultExchangeRateJsonMain = {
    ETH: { CNY: 3337.01, USD: 517.42 },
    BTC: { CNY: 42868.55, USD: 6598.71 },
    KT: { CNY: 0.03, USD: 0.19 },
    BNB: { CNY: 100, USD: 15.2625 },
    VEN: { CNY: 100, USD: 15.2625 },
    OMG: { CNY: 100, USD: 15.2625 },
    ZRX: { CNY: 100, USD: 15.2625 },
    MKR: { CNY: 100, USD: 15.2625 },
    BAT: { CNY: 100, USD: 15.2625 },
    XUC: { CNY: 100, USD: 15.2625 },
    REP: { CNY: 100, USD: 15.2625 },
    BTM: { CNY: 100, USD: 15.2625 },
    GNT: { CNY: 100, USD: 15.2625 },
    PPT: { CNY: 100, USD: 15.2625 },
    SNT: { CNY: 100, USD: 15.2625 },
    AION: { CNY: 100, USD: 15.2625 },
    FUN: { CNY: 100, USD: 15.2625 },
    KNC: { CNY: 100, USD: 15.2625 },
    MCO: { CNY: 100, USD: 15.2625 },
    POWR: { CNY: 100, USD: 15.2625 },
    MANA: { CNY: 100, USD: 15.2625 },
    KIN: { CNY: 100, USD: 15.2625 },
    VERI: { CNY: 100, USD: 15.2625 },
    HEALP: { CNY: 100, USD: 15.2625 }
};

// 默认货币汇率
export const defaultExchangeRateJson = config.currentNetIsTest ? defaultExchangeRateJsonTest : defaultExchangeRateJsonMain;

// eth代币transfer交易编码前缀
export const ethTokenTransferCode = '0xa9059cbb';

// 导航页广告
export const guidePages = [
    { imgUrl: 'banner1.png', text: '介绍我们的特色或者是更新内容，介绍我们的特色或者是更新内容，介绍我们的特色或者是更新内容' },
    { imgUrl: 'banner2.png', text: '以太坊，Ethereum是一个分布式的计算机，有许多的节点，其中的每一个节点，都会执行字节码（其实就是智能合约），然后把结果存在区块链上。' },
    { imgUrl: 'banner3.png', text: '智能合约与平时的代码其实没有什么区别，只是运行于一个以太坊这样的分布式平台上而已。' }
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