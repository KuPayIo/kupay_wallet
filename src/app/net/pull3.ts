import { thirdUrlPre } from '../config';
import { setStore } from '../store/memstore';
import { xorDecode1, xorEncode } from '../utils/tools';
import { changellySign } from './pull';

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

// ============================= changelly =========================================

// changelly api url
const changellyApiUrl = 'https://api.changelly.com';
const changellyPostId = 'kuplay';
const changellyFetchPost = (data) => {
    return changellySign(data).then(res => {
        const apiKey = res.key;
        const sign = res.sign;

        return fetch(changellyApiUrl, {
            body: JSON.stringify(data), 
            cache: 'no-cache',
            headers: {
                'content-type': 'application/json',
                'api-key': apiKey,
                sign: sign
            },
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer' // *client, no-referrer
        }).then(response => response.json()); // parses response to JSON
    });
};

/**
 * 获取可用的币币兑换
 */
export const changellyGetCurrencies = () => {
    const message = {
        jsonrpc: '2.0',
        id: changellyPostId,
        method: 'getCurrencies',
        params: {}
    };

    return changellyFetchPost(message).then(res => {
        if (res.result) {
            const currencies = res.result.map(item => item.toUpperCase());
            setStore('third/changellyCurrencies',currencies);
        }

        return res;
    });
};

/**
 * 获取所有的支持货币(有可能不可用)
 */
export const changellyGetCurrenciesFull = () => {
    const message = {
        jsonrpc: '2.0',
        id: changellyPostId,
        method: 'getCurrenciesFull',
        params: {}
    };
    
    return changellyFetchPost(message);
};

/**
 * 估算币币兑换汇率
 */
export const changellyGetExchangeAmount = (fromCurrency:string,toCurrency:string) => {
    const message = {
        jsonrpc: '2.0',
        id: changellyPostId,
        method: 'getExchangeAmount',
        params: {
            from: fromCurrency.toLowerCase(),
            to: toCurrency.toLowerCase(),
            amount: '1'
        }
    };

    return changellyFetchPost(message);
};
/**
 * 获取最小交易数量
 */
export const changellyGetMinAmount = (fromCurrency:string,toCurrency:string) => {
    const message = {
        jsonrpc: '2.0',
        id: changellyPostId,
        method: 'getMinAmount',
        params: {
            from: fromCurrency.toLowerCase(),
            to: toCurrency.toLowerCase()
        }
    };

    return changellyFetchPost(message);
}; 

/**
 * 创建一笔交易
 */
export const changellyCreateTransaction = (fromCurrency:string,toCurrency:string,toAddr:string,amount:number,refundAddress:string) => {
    const message = {
        jsonrpc: '2.0',
        id: changellyPostId,
        method: 'createTransaction',
        params: {
            from: fromCurrency.toLowerCase(),
            to: toCurrency.toLowerCase(),
            amount,
            address: toAddr,
            refundAddress
        }
    };

    return changellyFetchPost(message);
};

/**
 * 获取指定交易的状态   vlsrez4e0mh2yiwq
 */
export const changellyGetStatus = (id:string) => {
    const message = {
        jsonrpc: '2.0',
        id: changellyPostId,
        method: 'getStatus',
        params: {
            id
        }
    };

    return changellyFetchPost(message);
};
// 0x4c9a9d315d14192e8805bbe3bbf7d2582782c501
export const changellyGetTransactions = (currencyName:string,addr:string) => {
    const message = {
        jsonrpc: '2.0',
        id: changellyPostId,
        method: 'getTransactions',
        params: {
            currency: currencyName,
            address: addr,
            extraId: null,
            limit: 10,
            offset : 0
        }
    };

    return changellyFetchPost(message);
};