
/**
 * http协议
 */
import { ajax } from '../../../pi/lang/mod';

const logger = console;

const defaultPostHeaders = {
    // 'content-type': 'application/x-www-form-urlencoded',
    'Access-Control-Allow-Origin': '*',
    // 'Access-Control-Allow-Credentials': true,
    // 'Access-Control-Expose-Headers': 'FooBar',
    // 'Content-Type': 'text/html; charset=utf-8',
    // 'X-Custom-Header': 'value',
    'User-Agent': ''
};

const agentOptions = {
    keepAlive: true,
    maxSockets: 256
};

// tslint:disable-next-line:no-reserved-keywords
export const get = (url, options) => {
    // console.log(`${moment().format()} HttpGet: ${url}`)
    return new Promise((resolve, reject) => {
        options = options || {};
        const httpOptions = {
            url: url,
            method: 'get',
            timeout: options.timeout || 3000,
            headers: options.headers || defaultPostHeaders,
            proxy: options.proxy || '',
            agentOptions: agentOptions
        };
        ajax.get(url, options.headers || defaultPostHeaders, httpOptions, ajax.RESP_TYPE_TEXT, options.timeout || 3000,
            (err, res, body) => {
                if (err) {
                    reject(err);
                } else {
                    if (res.statusCode === 200) {
                        resolve(body);
                    } else {
                        reject(res.statusCode);
                    }
                }
            }, (err) => {
                reject(err);
            });
    });
};

export const post = (url, postdata, options) => {
    // console.log(`${moment().format()} HttpPost: ${url}`)
    return new Promise((resolve, reject) => {
        options = options || {};
        const httpOptions = {
            url: url,
            body: JSON.stringify(postdata),
            method: 'post',
            timeout: options.timeout || 3000,
            headers: options.headers || defaultPostHeaders,
            proxy: options.proxy || '',
            agentOptions: agentOptions
        };
        ajax.get(url, options.headers || defaultPostHeaders, httpOptions, ajax.RESP_TYPE_TEXT, options.timeout || 3000,
            (err, res, body) => {
                if (err) {
                    reject(err);
                } else {
                    if (res.statusCode === 200) {
                        resolve(body);
                    } else {
                        reject(res.statusCode);
                    }
                }
            }, (err) => {
                reject(err);
            });
    });
};

export const formPost = (url, postdata, options) => {
    // console.log(`${moment().format()} HttpFormPost: ${url}`)
    return new Promise((resolve, reject) => {
        options = options || {};
        const httpOptions = {
            url: url,
            form: postdata,
            method: 'post',
            timeout: options.timeout || 3000,
            headers: options.headers || defaultPostHeaders,
            proxy: options.proxy || '',
            agentOptions: agentOptions
        };
        ajax.get(url, options.headers || defaultPostHeaders, httpOptions, ajax.RESP_TYPE_TEXT, options.timeout || 3000,
            (err, res, body) => {
                if (err) {
                    reject(err);
                } else {
                    if (res.statusCode === 200) {
                        resolve(body);
                    } else {
                        reject(res.statusCode);
                    }
                }
            }, (err) => {
                reject(err);
            });
    });
};