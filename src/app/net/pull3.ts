import { thirdUrlPre } from "./pull";

//==========================三方接口=======================================
//http://api.k780.com/?app=finance.rate&scur=USD&tcur=CNY&appkey=10003&sign=b59bc3ef6191eb9f747dd4e83c99f2a4 测试
//http://api.k780.com/?app=finance.rate&scur=USD&tcur=CNY&appkey=37223&sign=7987216e841c32aa08d0ea0dcbf65eed
//https://api.huobipro.com/market/history/kline?symbol=btcusdt&period=1day&size=1&AccessKeyId=6fd70042-c5e4c618-d6e619ec-ecfa2
// 获取美元对人民币汇率
export const fetchUSD2CNYRate = ()=>{
    const url3Prefix = 'http://api.k780.com/?app=finance.rate&scur=USD&tcur=CNY';
    const url = `${thirdUrlPre}url=${encodeURIComponent(url3Prefix)}&type=rite`;
    return fetch(url).then(res=>res.json());
}


/**
 * 获取货币对比USDT的比率
 */
export const fetchCurrency2USDTRate = (currencyName:string)=>{
    // return new Promise((resolve)=>{
    //     setTimeout(()=>{
    //         const ret = {"status":"ok","ch":"market.btcusdt.kline.1day","ts":1539670505329,"data":[{"id":1539619200,"open":6905.170000000000000000,"close":6850.000000000000000000,"low":6654.000000000000000000,"high":6955.000000000000000000,"amount":7731.728723947506305218,"vol":52437756.909877504971432664790000000000000000,"count":47136}]};
    //         resolve(ret);
    //     },1500);
    // });
    if(currencyName === 'USDT') return;
    const symbol = `${currencyName.toLowerCase()}usdt`;
    const url3Prefix = `https://api.huobipro.com/market/history/kline?symbol=${symbol}`;
    const url = `${thirdUrlPre}url=${encodeURIComponent(url3Prefix)}&type=kline`;
    return fetch(url).then(res=>res.json());
}

//======================================================================

