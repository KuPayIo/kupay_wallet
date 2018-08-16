
/**
 * 常用工具
 */

export const setLocalStorage = (keyName:string,data:any) => {
    localStorage.setItem(keyName,JSON.stringify(data));
}; 
export const getLocalStorage = (keyName:string) => {
    return JSON.parse(localStorage.getItem(keyName));
};
 // 解析url参数
export const parseUrlParams = (search: string, key: string) => {
    const ret = search.match(new RegExp(`(\\?|&)${key}=(.*?)(&|$)`));

    return ret && decodeURIComponent(ret[2]);
};

// unicode数组转字符串
export const unicodeArray2Str = (arr) => {
    let str = '';
    for (let i = 0; i < arr.length;i++) {
        str += String.fromCharCode(arr[i]);
    }

    return str;
};

// 复制到剪切板
export const copyToClipboard = (copyText) => {
    const input = document.createElement('input');
    input.setAttribute('readonly', 'readonly');
    input.setAttribute('value', copyText);
    input.setAttribute('style', 'position:absolute;top:-9999px;');
    document.body.appendChild(input);
    input.setSelectionRange(0, 9999);
    input.select();
    if (document.execCommand('copy')) {
        document.execCommand('copy');
    }
    document.body.removeChild(input);
};

// 时间戳格式化
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

/**
 * kpt转kt
 */
export const kpt2kt = (num: number) => {
    if (!num) return 0;

    return num / Math.pow(10, 9);
};

/**
 * kt转kpt
 */
export const kt2kpt = (num: number) => {
    if (!num) return 0;

    return num * Math.pow(10, 9);
};

/**
 * kpt转kt
 */
export const wei2Eth = (num: number) => {
    if (!num) return 0;

    return num / Math.pow(10, 18);
};

/**
 * kt转kpt
 */
export const eth2Wei = (num: number) => {
    if (!num) return 0;

    return num * Math.pow(10, 18);
};

/**
 * 根据货币类型小单位转大单位  
 */
export const smallUnit2LargeUnitString = (currencyName:string,amount:string):number => {
    if (currencyName === 'ETH') {
        const pow = amount.length - 15;
        let num = Number(amount.slice(0,15));
        num = wei2Eth(num);
        num  = num * Math.pow(10,pow);

        return formatBalance(num);
    } else if (currencyName === 'KT') {
        return formatBalance(kpt2kt(Number(amount)));
    }
};

/**
 * 根据货币类型大单位转小单位
 */
export const largeUnit2SmallUnitString = (currencyName:string,amount:number):string => {
    if (currencyName === 'ETH') {
        return eth2Wei(amount).toLocaleString().replace(/,/g,'');
    } else if (currencyName === 'KT') {
        return kt2kpt(amount).toLocaleString().replace(/,/g,'');
    }
};

/**
 * 金额格式化
 * @param banlance 金额
 */
export const formatBalance = (banlance: number) => {
    return Number(banlance.toFixed(6));
};