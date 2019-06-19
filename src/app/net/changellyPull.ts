import { setStoreData } from '../middleLayer/wrap';
import { changellySign } from './pull';

// ============================= changelly =========================================

// changelly api url
const changellyApiUrl = 'https://api.changelly.com';
const changellyPostId = 'kuplay';
// TODO 先向服务器签名
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
            setStoreData('third/changellyCurrencies',currencies);
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
