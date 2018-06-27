/**
 * 一些常用常量
 */

 // 钱包数量最大限制
export const walletNumLimit = 10;

// 钱包所支持得货币列表
export const supportCurrencyList = [{ name: 'ETH', description: 'Ethereum' }, 
    { name: 'BTC', description: 'Bit coin' }, 
    { name: 'EOS', description: 'EOS currency' }, 
    { name: 'ETC', description: 'Ethereum Classic' }, 
    { name: 'BCH', description: 'Bitcoin Cash' }, 
    { name: 'XRP', description: 'Ripple' }, 
    { name: 'YNC', description: 'YiNeng Ltd' }];

// 默认显示得ETH代币
export const defaultEthToken = ['YNC'];

// 默认显示货币列表
export const defalutShowCurrencys = ['ETH', 'BTC', 'YNC'];

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
    YNC:{ CNY: 100 , USD: 15.2625 }
};

// eth代币transfer交易编码前缀
export const ethTokenTransferCode = '0xa9059cbb';