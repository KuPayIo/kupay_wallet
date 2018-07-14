import { str_md5 } from '../../../pi/util/md5';
import { get, post } from './httpClient';

// let config = require('config');
// let CryptoJS = require('crypto-js');
// let Promise = require('bluebird');
// let moment = require('moment');
// let HmacSHA256 = require('crypto-js/hmac-sha256');
/**
 * http协议
 */
const URL_HUOBI_PRO = 'api.huobipro.com';
// const URL_HUOBI_PRO = 'api.huobi.pro'; //备用地址

const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36',
    AuthData: null
};

const getAuth = (config) => {
    const sign = `${config.huobi.trade_password}hello, moto`;
    // todo md5处理
    const md5 = str_md5(sign).toString().toLowerCase();

    return encodeURIComponent(JSON.stringify({
        assetPwd: md5
    }));
};

const signSha = (method, baseurl, path, data, config) => {
    const pars = [];
    for (const item in data) {
        pars.push(`${item}=${encodeURIComponent(data[item])}`);
    }
    let p = pars.sort().join('&');
    const meta = [method, baseurl, path, p].join('\n');
    // console.log(meta);
    // // todo HmacSHA256处理
    // const hash = HmacSHA256(meta, config.huobi.secretkey);
    // // todo Base64处理
    // const Signature = encodeURIComponent(CryptoJS.enc.Base64.stringify(hash));
    const Signature = '';
    // console.log(`Signature: ${Signature}`);
    p += `&Signature=${Signature}`;
    // console.log(p);

    return p;
};

const getBody = (config) => {
    return {
        AccessKeyId: config.huobi.access_key,
        SignatureMethod: 'HmacSHA256',
        SignatureVersion: 2,
        // todo 时间格式化
        // Timestamp: moment.utc().format('YYYY-MM-DDTHH:mm:ss')
        Timestamp: ''
    };
};

const callApi = (method, path, payload, body, config) => {
    return new Promise(resolve => {
        const accountId = config.huobi.account_id_pro;
        const url = `https://${URL_HUOBI_PRO}${path}?${payload}`;
        console.log(url);
        const headers = DEFAULT_HEADERS;
        headers.AuthData = getAuth(config);

        if (method === 'GET') {
            get(url, {
                timeout: 1000,
                headers: headers
            }).then(data => {
                const json = JSON.parse(<any>data);
                if (json.status === 'ok') {
                    console.log(json.data);
                    resolve(json.data);
                } else {
                    console.log('调用错误', json);
                    resolve(null);
                }
            }).catch(ex => {
                console.log(method, path, '异常', ex);
                resolve(null);
            });
        } else if (method === 'POST') {
            post(url, body, {
                timeout: 1000,
                headers: headers
            }).then(data => {
                const json = JSON.parse(<any>data);
                if (json.status === 'ok') {
                    console.log(json.data);
                    resolve(json.data);
                } else {
                    console.log('调用错误', json);
                    resolve(null);
                }
            }).catch(ex => {
                console.log(method, path, '异常', ex);
                resolve(null);
            });
        }
    });
};

export const getAccount = (config) => {
    const path = `/v1/account/accounts`;
    const body = getBody(config);
    const payload = signSha('GET', URL_HUOBI_PRO, path, body, config);

    return callApi('GET', path, payload, body, config);
};

export const getBalance = (config) => {
    const accountId = config.huobi.account_id_pro;
    const path = `/v1/account/accounts/${accountId}/balance`;
    const body = getBody(config);
    const payload = signSha('GET', URL_HUOBI_PRO, path, body, config);

    return callApi('GET', path, payload, body, config);

};

export const getOpenOrders = (mySymbol, config) => {
    const path = `/v1/order/orders`;
    const body: any = getBody(config);
    body.symbol = mySymbol;
    body.states = 'submitted,partial-filled';
    const payload = signSha('GET', URL_HUOBI_PRO, path, body, config);

    return callApi('GET', path, payload, body, config);
};

export const getOrder = (orderId, config) => {
    const path = `/v1/order/orders/${orderId}`;
    const body = getBody(config);
    const payload = signSha('GET', URL_HUOBI_PRO, path, body, config);

    return callApi('GET', path, payload, body, config);
};

export const buyLimit = (mySymbol, amount, price, config) => {
    const path = '/v1/order/orders/place';
    const body: any = getBody(config);
    const payload = signSha('GET', URL_HUOBI_PRO, path, body, config);

    body['account-id'] = config.huobi.account_id_pro;
    body.type = 'buy-limit';
    body.amount = amount;
    body.symbol = mySymbol;
    body.price = price;

    return callApi('GET', path, payload, body, config);
};

export const sellLimit = (mySymbol, amount, price, config) => {
    const path = '/v1/order/orders/place';
    const body: any = getBody(config);
    const payload = signSha('GET', URL_HUOBI_PRO, path, body, config);

    body['account-id'] = config.huobi.account_id_pro;
    body.type = 'sell-limit';
    body.amount = amount;
    body.symbol = mySymbol;
    body.price = price;

    return callApi('GET', path, payload, body, config);
};

export const withdrawal = (address, coin, amount, paymentId, config) => {
    const path = `/v1/dw/withdraw/api/create`;
    const body: any = getBody(config);
    const payload = signSha('GET', URL_HUOBI_PRO, path, body, config);

    body.address = address;
    body.amount = amount;
    body.currency = coin;
    if (coin.toLowerCase() === 'xrp') {
        if (paymentId) {
            body['addr-tag'] = paymentId;
        } else {
            console.log('huobi withdrawal', coin, 'no payment id provided, cancel withdrawal');

            return Promise.resolve(null);
        }
    }

    return callApi('GET', path, payload, body, config);
};
