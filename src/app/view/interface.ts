/**
 * 一些数据结构接口
 */

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
 * 地址对象
 */
export interface Addr {
    addr: string;// 地址
    addrName: string;// 地址名
    balance: number;// 余额
    currencyName: string;// 货币类型
    record: any[];// 记录缓存
}
