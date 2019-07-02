import { sourceIp, thirdUrlPre } from './config';
import { xorDecode1, xorEncode } from './tools';

// ==========================三方接口=======================================
/**
 * 获取第三方数据
 */
export const getThirdFromServer = async (url:string,timestamp:number) => {
    const key = '123'; 
    const xorEncodeUrl = xorEncode(url,key);
    const realUrl = `${thirdUrlPre}?key=${key}&url=${xorEncodeUrl}&timestamp=${timestamp}&$forceServer=1`;

    return fetch(realUrl).then(res => res.json()).catch();

};

// http://api.k780.com/?app=finance.rate&scur=USD&tcur=CNY&appkey=10003&sign=b59bc3ef6191eb9f747dd4e83c99f2a4 测试
// http://api.k780.com/?app=finance.rate&scur=USD&tcur=CNY&appkey=37223&sign=7987216e841c32aa08d0ea0dcbf65eed
// https://api.huobipro.com/market/history/kline?symbol=btcusdt&period=1day&size=1&AccessKeyId=6fd70042-c5e4c618-d6e619ec-ecfa2
// 获取美元对人民币汇率
export const fetchUSD2CNYRate = () => {
    // const sign = '2ce17bfdcb19060cac834341e493c5e1';
    // const appkey = '38071';
    // const url = `http://api.k780.com/?app=finance.rate&scur=USD&tcur=CNY&appkey=${appkey}&sign=${sign}`;

    const date = new Date();
    date.setMinutes(0);
    date.setSeconds(0);
    const timestamp = parseInt((date.getTime() / 1000).toString(),10);
    
    const url = 'https://v3.exchangerate-api.com/bulk/b2c2d7f4732bd71f63730357/USD';

    return getThirdFromServer(url,timestamp).then(res => {
        const str = xorDecode1(res.value,res.pk);

        return JSON.parse(str);
    });
};

/**
 * 获取货币对比USDT的比率
 */
export const fetchCurrency2USDTRate = (currencyName:string) => {
    // https://www.okex.com/api/v1/kline.do?symbol=ltc_btc&type=1min&size=1

    const date = new Date();
    if (date.getSeconds() >= 30) {
        date.setMinutes(date.getMinutes() + 1);
    } else {
        date.setSeconds(0);
    }
    const timestamp = parseInt((date.getTime() / 1000).toString(),10);

    // tslint:disable-next-line:no-reserved-keywords
    const symbol = `${currencyName.toLowerCase()}_usdt`;
    const url = `https://www.okex.com/api/v1/kline.do?symbol=${symbol}&type=1day&size=1`;

    return getThirdFromServer(url,timestamp).then(res => {
        const str = xorDecode1(res.value,res.pk);

        return JSON.parse(str);
    }); 
};

/**
 * 获取官方客服等配置信息
 */
export const getOfficial = () => {
    const url = `http://${sourceIp}/appversion/official_service.json?${Math.random()}`;

    return fetch(url).then(res => res.json()).catch();
};