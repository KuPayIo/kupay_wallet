/**
 * 一些数据结构接口
 */

/**
 * localstorage wallet object
 */
 export interface Wallet{
    walletId:string;  //wallet id  (first address)
    walletPsw:string; // wallet password
    walletPswTips?:string;// wallet password tips
    gwlt:string;  // Serialization GaiaWallet object
    showCurrencys:Array<string>; //home page show currencys
    currencyRecords:[{     // currency records 
        currencyName:string; // currency Name 
        currentAddr:string;//current address
        addrs:[{
            addr:string;  // address
            addrName:string; // address name
            gwlt:string;
            record:Array<Object>; // transaction records
        }]
    }]
 }