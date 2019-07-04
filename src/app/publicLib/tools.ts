
/***
 * 共用 tools
 */
import { Config, inJSVM } from './config';
import { CurrencyRecord } from './interface';
import { getModulConfig } from './modulConfig';

/**
 * 货币判断
 */
export const currencyType = (str:string) => {
    if (str === 'ST') {
        return getModulConfig('ST_SHOW');
    } else if (str === 'KT') {
        return getModulConfig('KT_SHOW');
    } else if (str === 'SC') {
        return getModulConfig('SC_SHOW');
    } else {
        return str;
    }
};

/**
 * 金额格式化
 * @param banlance 金额
 */
export const formatBalance = (banlance: number) => {
    banlance = Number(banlance);
    if (!banlance) return 0;

    return Number(banlance.toFixed(6));
};

/**
 * 余额格式化
 */
export const formatBalanceValue = (value: number) => {
    if (value === 0) return '0.00';

    return value.toFixed(2);
};

/**
 * 计算日期间隔
 */
export const GetDateDiff = (startDate, endDate) => {
    let Y = `${startDate.getFullYear()}-`;
    let M = `${(startDate.getMonth() + 1 < 10 ? `0${(startDate.getMonth() + 1)}` : startDate.getMonth() + 1)}-`;
    let D = `${startDate.getDate()}`;
    startDate = new Date(`${Y}${M}${D}`);
    const startTime = startDate.getTime();
    Y = `${endDate.getFullYear()}-`;
    M = `${(endDate.getMonth() + 1 < 10 ? `0${(endDate.getMonth() + 1)}` : endDate.getMonth() + 1)}-`;
    D = `${endDate.getDate()}`;
    endDate = new Date(`${Y}${M}${D}`);
    const endTime = endDate.getTime();

    return Math.floor(Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24));
};

// 时间戳格式化 毫秒为单位
export const timestampFormatToDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : `0${date.getMonth() + 1}`;
    const day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`;

    return `${year}-${month}-${day}`;
};

// 时间戳格式化 毫秒为单位
export const timestampFormat = (timestamp: number) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : `0${date.getMonth() + 1}`;
    const day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`;
    const hour = date.getHours() >= 10 ? date.getHours() : `0${date.getHours()}`;
    const minutes = date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`;
    const seconds = date.getSeconds() >= 10 ? date.getSeconds() : `0${date.getSeconds()}`;

    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
};

// unicode数组转字符串
export const unicodeArray2Str = (arr) => {
    let str = '';
    if (!arr || arr === 'null') {
        return str;
    }
    if (typeof arr === 'string') {   // 如果本身是字符串直接返回
        return arr;
    }
    for (let i = 0; i < arr.length; i++) {
        str += String.fromCharCode(arr[i]);
    }

    return str;
};

/**
 * 数字前边加0
 */
const addPerZero = (num: number, len: number) => {
    const numStr = num.toString();
    const perLen = len - numStr.length;
    if (perLen <= 0) return numStr;
    const list = [];
    list.length = perLen;

    return list.fill('0').join('') + numStr;
};

/**
 * 转化显示时间格式为‘04-30 14:32:00’
 */
export const transDate = (t: Date) => {
    // tslint:disable-next-line:max-line-length
    return `${addPerZero(t.getUTCMonth() + 1, 2)}-${addPerZero(t.getUTCDate(), 2)} ${addPerZero(t.getHours(), 2)}:${addPerZero(t.getMinutes(), 2)}:${addPerZero(t.getSeconds(), 2)}`;
};

/**
 * u8数组转十六进制字符串
 * 
 * @param u8Array 输入数组
 */
export const u8ArrayToHexstr = (u8Array: Uint8Array) => {
    let str = '';
    for (let i = 0; i < u8Array.length; i++) {
        str += Math.floor(u8Array[i] / 16).toString(16);
        str += (u8Array[i] % 16).toString(16);
        // str += u8Array[i].toString(16);
    }
    if (str[0] === '0') str = str.slice(1);

    return str;
};

/**
 * 十六进制字符串转u8数组
 * 
 * @param str 输入字符串
 */
export const hexstrToU8Array = (str: string) => {
    if (str.length % 2 > 0) str = `0${str}`;

    const r = new Uint8Array(str.length / 2);
    for (let i = 0; i < str.length; i += 2) {
        const high = parseInt(str.charAt(i), 16);
        const low = parseInt(str.charAt(i + 1), 16);
        r[i / 2] = (high * 16 + low);
    }

    return r;
};

/**
 * 获取异或值
 * @param first 前段
 * @param second 后段
 */

export const getXOR = (first, second) => {
    if (first.length !== second.length) return '';

    const arr = [];
    for (let i = 0; i < first.length; i++) {
        const m = parseInt(first.substr(i, 1), 16);
        const k = parseInt(second.substr(i, 1), 16);
        arr.push((m ^ k).toString(16));
    }

    return arr.join('');
};

/**
 * 通过地址获取地址余额
 */
export const getAddrInfoByAddr = (currencyRecords:CurrencyRecord[],addr: string, currencyName: string) => {
    for (const record of currencyRecords) {
        if (record.currencyName === currencyName) {
            for (const addrInfo of record.addrs) {
                if (addrInfo.addr === addr) {
                    return addrInfo;
                }
            }
        }
    }
};

// 获取SC涨跌情况 
export const fetchCloudGain = () => {
    return formatBalanceValue(0);
};

/**
 * 转化rtype
 */
export const parseRtype = (rType:number,lang:string) => {
    if (rType === 0) return Config[lang].luckeyMoney.ordinary; // 普通
    if (rType === 1) return Config[lang].luckeyMoney.random; // 随机
    if (rType === 99) return Config[lang].luckeyMoney.invite; // 邀请

    return '';
};

/**
 * 异或解码 解析16进制
 */
export const xorDecode1 = (str:string, key:string) => {
    const u8arr = hexstrToU8Array(str);
    const ord = []; 
    let res = '';

    for (let i = 1; i <= 255; i++) {ord[String.fromCharCode(i)] = i;}
    for (let i = 0; i < u8arr.length;i++) {
        res += String.fromCharCode(u8arr[i] ^ ord[key.substr(i %    key.length, 1)]);
    }

    return res;
};

/**
 * 异或编码
 */
export const xorEncode = (str:string, key:string) => {
    const ord = []; 
    let res = '';

    for (let i = 1; i <= 255; i++) {ord[String.fromCharCode(i)] = i;}

    for (let i = 0; i < str.length; i++) {
        const code = ord[str.substr(i, 1)] ^ ord[key.substr(i %    key.length, 1)];
        if (code < 16) {
            res += `0${code.toString(16)}`;
        } else {
            res += code.toString(16);
        }
    }

    return res;
};

declare var pi_modules;
/**
 * 封装ajax成fetch模式
 * @param url  请求url
 * @param header 请求头
 */
export const piFetch = (url:string,param?:any):Promise<any> => {
    // return Promise.reject();
    if (!inJSVM) return fetch(url,param).then(res => res.json());

    return new Promise((resolve,reject) => {
        if (param && param.method === 'POST') {   // post
            // tslint:disable-next-line:max-line-length
            pi_modules.ajax.exports.post(url,param.headers,param.body,'string',param.headers['Content-Type'] || 'application/json',pi_modules.ajax.exports.RESP_TYPE_TEXT,(res) => {
                console.log(`piFetch POST ${url} success===`,res);
                try {
                    resolve(JSON.parse(res));
                } catch (err) {
                    resolve(res);
                }
                
            },(err) => {
                console.log(`piFetch POST ${url} err===`,err);
                try {
                    reject(JSON.parse(err));
                } catch (err) {
                    reject(err);
                }
            });
        } else {    // get
            pi_modules.ajax.exports.get(url,undefined,param && param.body,'string',pi_modules.ajax.exports.RESP_TYPE_TEXT,(res) => {
                console.log(`piFetch GET ${url} success===`,res);
                try {
                    resolve(JSON.parse(res));
                } catch (err) {
                    resolve(res);
                }
            },(err) => {
                console.log(`piFetch GET ${url} err===`,err);
                try {
                    reject(JSON.parse(err));
                } catch (err) {
                    reject(err);
                }
            });
        }
        
    });
};