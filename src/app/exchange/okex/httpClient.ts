
/**
 * http协议
 */
import { ajax } from '../../../pi/lang/mod';

const logger = console;

const defaultPostHeaders = {
    'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
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
            agentOptions: agentOptions,
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, same-origin, *omit
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer' // no-referrer, *client
        };
        fetch(url, <any>httpOptions)
            .then(response => {
                console.log(response);
                // response.json()
                // if (err) {
                //     reject(err);
                // } else {
                //     if (res.statusCode === 200) {
                //         resolve(body);
                //     } else {
                //         reject(res.statusCode);
                //     }
                // }
                resolve(response);
            }) // parses response to JSON
            .catch(error => console.error(`Fetch Error =\n`, error));

        // ajax.get(url, options.headers || defaultPostHeaders, httpOptions, ajax.RESP_TYPE_TEXT, options.timeout || 3000,
        //     (err, res, body) => {
        //         if (err) {
        //             reject(err);
        //         } else {
        //             if (res.statusCode === 200) {
        //                 resolve(body);
        //             } else {
        //                 reject(res.statusCode);
        //             }
        //         }
        //     }, (err) => {
        //         reject(err);
        //     });
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