/**
 * 一些数据结构接口
 */

/**
 * localstorage wallet object
 */
export interface Wallet {
    walletId: string;  // wallet id  (first address)
    avatar: string;
    walletPsw: string; // wallet password
    walletPswTips?: string;// wallet password tips
    gwlt: string;  // Serialization GaiaWallet object
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
}
/**
 * 地址对象
 */
export interface Addr {
    addr: string;// 地址
    addrName: string;// 地址名
    balance: number;// 余额
    currencyName: string;// 货币类型
    gwlt: string;// 钱包对象字符串化
    record: any[];// 记录缓存
}