/**
 * 一些常用常量
 */

 // 钱包数量最大限制
export const walletNumLimit = 10;

// 钱包所支持的货币列表
/* { name: 'ETC', description: 'Ethereum Classic' }, 
    { name: 'BCH', description: 'Bitcoin Cash' }, 
    { name: 'XRP', description: 'Ripple' }, 
    { name: 'YNC', description: 'YiNeng Ltd' } */
export const supportCurrencyList = [
    { name: 'ETH', description: 'Ethereum' }, 
    { name: 'BTC', description: 'Bit coin' }, 
    { name: 'EOS', description: 'EOS currency' }, 
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

// 默认显示得ETH代币
export const defaultEthToken = [];

// 默认显示货币列表
export const defalutShowCurrencys = ['ETH', 'BTC','EOS'];

//
export const strength = 128;

// btc网络
export const btcNetwork = 'testnet';

// 语言
export const lang = 'english';

// 默认货币汇率
export const defaultExchangeRateJson = {
    ETH:{ CNY: 3337.01, USD: 517.42 },
    BTC:{ CNY: 42868.55 , USD: 6598.71 },
    YNC:{ CNY: 100 , USD: 15.2625 },
    BNB:{ CNY: 100 , USD: 15.2625 },
    VEN:{ CNY: 100 , USD: 15.2625 },
    OMG:{ CNY: 100 , USD: 15.2625 },
    ZRX:{ CNY: 100 , USD: 15.2625 },
    MKR:{ CNY: 100 , USD: 15.2625 },
    BAT:{ CNY: 100 , USD: 15.2625 },
    XUC:{ CNY: 100 , USD: 15.2625 },
    REP:{ CNY: 100 , USD: 15.2625 },
    BTM:{ CNY: 100 , USD: 15.2625 },
    GNT:{ CNY: 100 , USD: 15.2625 },
    PPT:{ CNY: 100 , USD: 15.2625 },
    SNT:{ CNY: 100 , USD: 15.2625 },
    AION:{ CNY: 100 , USD: 15.2625 },
    FUN:{ CNY: 100 , USD: 15.2625 },
    KNC:{ CNY: 100 , USD: 15.2625 },
    MCO:{ CNY: 100 , USD: 15.2625 },
    POWR:{ CNY: 100 , USD: 15.2625 },
    MANA:{ CNY: 100 , USD: 15.2625 },
    KIN:{ CNY: 100 , USD: 15.2625 },
    VERI:{ CNY: 100 , USD: 15.2625 },
    HEALP:{ CNY: 100 , USD: 15.2625 }
};

// eth代币transfer交易编码前缀
export const ethTokenTransferCode = '0xa9059cbb';


//导航页广告
export const guidePages = [
    {imgUrl:"banner1.png",text:"介绍我们的特色或者是更新内容，介绍我们的特色或者是更新内容，介绍我们的特色或者是更新内容"},
    {imgUrl:"banner2.png",text:"以太坊，Ethereum是一个分布式的计算机，有许多的节点，其中的每一个节点，都会执行字节码（其实就是智能合约），然后把结果存在区块链上。"},
    {imgUrl:"banner3.png",text:"智能合约与平时的代码其实没有什么区别，只是运行于一个以太坊这样的分布式平台上而已。"}
];