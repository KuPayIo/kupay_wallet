import { thirdUrlPre } from '../config';
import { xorDecode1, xorEncode } from '../utils/tools';

// ==========================三方接口=======================================
/**
 * 获取第三方数据
 */
export const getThirdFromServer = async (url:string) => {
    const key = '123'; 
    const xorEncodeUrl = xorEncode(url,key);
    const date = new Date();
    if (date.getSeconds() >= 30) {
        date.setMinutes(date.getMinutes() + 1);
    } else {
        date.setSeconds(0);
    }
    const timestamp = parseInt((date.getTime() / 1000).toString(),10);
    const realUrl = `${thirdUrlPre}?key=${key}&url=${xorEncodeUrl}&timestamp=${timestamp}&$forceServer=1`;
    // console.log(realUrl);

    return fetch(realUrl).then(res => res.json());

};

// http://api.k780.com/?app=finance.rate&scur=USD&tcur=CNY&appkey=10003&sign=b59bc3ef6191eb9f747dd4e83c99f2a4 测试
// http://api.k780.com/?app=finance.rate&scur=USD&tcur=CNY&appkey=37223&sign=7987216e841c32aa08d0ea0dcbf65eed
// https://api.huobipro.com/market/history/kline?symbol=btcusdt&period=1day&size=1&AccessKeyId=6fd70042-c5e4c618-d6e619ec-ecfa2
// 获取美元对人民币汇率
export const fetchUSD2CNYRate = () => {
    const sign = '2ce17bfdcb19060cac834341e493c5e1';
    const appkey = '38071';
    const url = `http://api.k780.com/?app=finance.rate&scur=USD&tcur=CNY&appkey=${appkey}&sign=${sign}`;
    
    return getThirdFromServer(url).then(res => {
        const str = xorDecode1(res.value,res.pk);

        return JSON.parse(str);
    });
};

/**
 * 获取货币对比USDT的比率
 */
export const fetchCurrency2USDTRate = (currencyName:string) => {
    // https://www.okex.com/api/v1/kline.do?symbol=ltc_btc&type=1min&size=1
    // tslint:disable-next-line:no-reserved-keywords
    const symbol = `${currencyName.toLowerCase()}_usdt`;
    const url = `https://www.okex.com/api/v1/kline.do?symbol=${symbol}&type=1day&size=1`;
    
    return getThirdFromServer(url).then(res => {
        const str = xorDecode1(res.value,res.pk);

        return JSON.parse(str);
    }); 
};

// ======================================================================

/**
 * 获取货币对比USDT的比率
 */
export const shapeshiftMarketinfo = () => {
    const url = `https://shapeshift.io/marketinfo/btc_ltc`;

    return fetch(url).then(res => res.json()).then(json => {
        console.log('shapeshiftMarketinfo------',json);
    });
};
