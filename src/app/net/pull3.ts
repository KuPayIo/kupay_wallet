import { getRequest } from "../logic/native";
import { huobiApi } from "../utils/constants";

//==========================三方接口=======================================
//http://api.k780.com/?app=finance.rate&scur=USD&tcur=CNY&appkey=10003&sign=b59bc3ef6191eb9f747dd4e83c99f2a4 测试
//http://api.k780.com/?app=finance.rate&scur=USD&tcur=CNY&appkey=37223&sign=7987216e841c32aa08d0ea0dcbf65eed
//https://api.huobipro.com/market/history/kline?symbol=btcusdt&period=1day&size=1&AccessKeyId=6fd70042-c5e4c618-d6e619ec-ecfa2
// 获取美元对人民币汇率
export const fetchUSD2CNYRate = ()=>{
    return new Promise(resolve=>{
        setTimeout(()=>{
            const ret = {
                "success":"1",
                "result":{
                    "status":"ALREADY",
                    "scur":"USD",
                    "tcur":"CNY",
                    "ratenm":"美元/人民币",
                    "rate":"6.903500",
                    "update":"2018-10-12 10:15:08"
                }
            }
            resolve(ret);
        },1500);
    });
}


/**
 * 获取货币对比USDT的比率
 */
export const fetchCurrency2USDTRate = (currencyName:string)=>{
    if(currencyName === 'USDT') return;
    const symbol = `${currencyName.toLowerCase()}usdt`;
    const url = `${huobiApi}${symbol}`
    return getRequest(url);
}

//======================================================================