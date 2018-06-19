/**
 * common tools
 */
import { isNumber } from '../../pi/util/util';
import { Api as BtcApi } from '../core/btc/api';
import { Cipher } from '../core/crypto/cipher';
import { Api as EthApi } from '../core/eth/api';
import { dataCenter } from '../store/dataCenter';
import { find, updateStore } from '../store/store';
import { Addr } from '../view/interface';

export const setLocalStorage = (key: string, data: any, notified?: boolean) => {
    updateStore(key, data, notified);
};

export const getLocalStorage = (key: string) => {
    return find(key);
};

export const getCurrentWallet = (wallets) => {
    if (!(wallets && wallets.curWalletId && wallets.curWalletId.length > 0)) {
        return null;
    }
    for (let i = 0; i < wallets.walletList.length; i++) {
        if (wallets.walletList[i].walletId === wallets.curWalletId) {
            return wallets.walletList[i];
        }
    }

    return null;
};

/**
 * 获取当前钱包index
 * @param wallets wallets obj
 */
export const getCurrentWalletIndex = (wallets) => {
    let index = -1;
    if (!(wallets && wallets.curWalletId && wallets.curWalletId.length > 0)) {
        return -1;
    }
    for (let i = 0; i < wallets.walletList.length; i++) {
        if (wallets.walletList[i].walletId === wallets.curWalletId) {
            index = i;
            break;
        }
    }

    return index;
};

/**
 * 通过地址id获取地址信息
 * @param addrId  address id
 */
export const getAddrById = (addrId): Addr => {
    const list: Addr[] = getLocalStorage('addrs') || [];

    return list.filter(v => v.addr === addrId)[0];
};

/**
 * 通过地址id重置地址
 * @param addrId address id
 * @param data  新地址
 * @param notified 是否通知数据发生改变 
 */
export const resetAddrById = (addrId, data: Addr, notified?: boolean) => {
    let list: Addr[] = getLocalStorage('addrs') || [];
    list = list.map(v => {
        if (v.addr !== addrId) return v;

        return data;
    });
    setLocalStorage('addrs', list, notified);
};

/**
 * 获取钱包下的所有地址
 * @param wallet wallet obj
 */
export const getAddrsAll = (wallet) => {
    const currencyRecords = wallet.currencyRecords;
    const retAddrs = [];
    currencyRecords.forEach((item) => {
        item.addrs.forEach((addr) => {
            retAddrs.push(addr);
        });
    });

    return retAddrs;
};

// Password used to encrypt the plainText
const passwd = 'gaia';
/**
 * 密码加密
 * @param plainText 需要加密的文本
 */
export const encrypt = (plainText: string) => {
    const cipher = new Cipher();

    return cipher.encrypt(passwd, plainText);
};

/**
 * 密码解密
 * @param cipherText 需要解密的文本
 */
export const decrypt = (cipherText: string) => {
    const cipher = new Cipher();

    return cipher.decrypt(passwd, cipherText);
};

export const randomRgbColor = () => { // 随机生成RGB颜色
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    return `rgb(${r},${g},${b})`; // 返回rgb(r,g,b)格式颜色
};

/**
 * 解析显示的账号信息
 * @param str 需要解析的字符串
 */
export const parseAccount = (str: string) => {
    if (str.length <= 29) return str;

    return `${str.slice(0, 13)}...${str.slice(str.length - 13, str.length)}`;
};

export const getDefaultAddr = (addr: number | string) => {
    const addrStr = addr.toString();

    return `${addrStr.slice(0, 3)}...${addrStr.slice(-3)}`;
};

/**
 * wei转Eth
 */
export const wei2Eth = (num: number) => {
    return num / Math.pow(10, 18);
};

/**
 * wei转Eth
 */
export const eth2Wei = (num: number) => {
    return num * Math.pow(10, 18);
};

/**
 * sat转btc
 */
export const sat2Btc = (num: number) => {
    return num / Math.pow(10, 8);
};

/**
 * btc转sat
 */
export const btc2Sat = (num: number) => {
    return num * Math.pow(10, 8);
};

/**
 * 获取有效的货币
 * 
 * @param perNum 转化前数据
 * @param currencyName  当前货币类型
 * @param conversionType 转化类型
 * @param isWei 是否wei转化
 */
export const effectiveCurrency = (perNum: any, currencyName: string, conversionType: string, isMinUnit: boolean) => {

    const r: any = { num: 0, show: '', conversionShow: '' };
    const rate: any = dataCenter.getExchangeRate(currencyName);
    let num;
    if (currencyName === 'ETH') {
        num = isMinUnit ? wei2Eth(!isNumber(perNum) ? perNum.toNumber() : perNum) : perNum;
    } else if (currencyName === 'BTC') {
        num = isMinUnit ? sat2Btc(!isNumber(perNum) ? perNum.toNumber() : perNum) : perNum;
    }
    r.num = num;
    r.show = `${num} ${currencyName}`;
    r.conversionShow = `≈${(num * rate[conversionType]).toFixed(2)} ${conversionType}`;

    return r;

};
/**
 * 获取有效的货币不需要转化
 * 
 * @param perNum 转化前数据
 * @param currencyName  当前货币类型
 * @param isWei 是否wei转化
 */
export const effectiveCurrencyNoConversion = (perNum: any, currencyName: string, isMinUnit: boolean) => {
    const r: any = { num: 0, show: '', conversionShow: '' };
    if (currencyName === 'ETH') {
        const num = isMinUnit ? wei2Eth(!isNumber(perNum) ? perNum.toNumber() : perNum) : perNum;

        r.num = num;
        r.show = `${num} ETH`;
    } else if (currencyName === 'BTC') {
        const num = isMinUnit ? sat2Btc(!isNumber(perNum) ? perNum.toNumber() : perNum) : perNum;

        r.num = num;
        r.show = `${num} BTC`;
    }

    return r;

};

/**
 * 获取有效的货币不需要转化
 * 
 * @param perNum 转化前数据
 * @param currencyName  当前货币类型
 * @param isWei 是否wei转化
 */
export const effectiveCurrencyStableConversion = (perNum: any, currencyName: string, conversionType: string, isWei: boolean, rate: any) => {
    const r: any = { num: 0, show: '', conversionShow: '' };
    if (currencyName === 'ETH') {
        const num = isWei ? wei2Eth(!isNumber(perNum) ? perNum.toNumber() : perNum) : perNum;

        r.num = num;
        r.show = `${num} ETH`;
        r.conversionShow = `≈${(num * rate[conversionType]).toFixed(2)} ${conversionType}`;
    }

    return r;

};

/**
 * 转化显示时间
 * @param t date
 */
export const parseDate = (t: Date) => {
    // tslint:disable-next-line:max-line-length
    return `${t.getUTCFullYear()}-${addPerZero(t.getUTCMonth() + 1, 2)}-${addPerZero(t.getUTCDate(), 2)} ${addPerZero(t.getHours(), 2)}:${addPerZero(t.getMinutes(), 2)}`;
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

// 数组乱序
export const shuffle = (arr: any[]): any[] => {
    const length = arr.length;
    const shuffled = Array(length);
    for (let index = 0, rand; index < length; index++) {
        rand = ~~(Math.random() * (index + 1));
        if (rand !== index) {
            shuffled[index] = shuffled[rand];
        }
        shuffled[rand] = arr[index];
    }

    return shuffled;
};

/**
 * 获取字符串有效长度
 * @param str 字符串
 * 
 * 中文字符算2个字符
 */
export const getStrLen = (str): number => {
    if (str === null) return 0;
    if (typeof str !== 'string') {
        str += '';
    }

    return str.replace(/[^\x00-\xff]/g, '01').length;
};

/**
 * 截取字符串
 * @param str 字符串
 * @param start 开始位置
 * @param len 截取长度
 */
export const sliceStr = (str, start, len): string => {
    if (str === null) return '';
    if (typeof str !== 'string') str += '';
    let r = '';
    for (let i = start; i < str.length; i++) {
        len--;
        if (str.charCodeAt(i) > 127 || str.charCodeAt(i) === 94) {
            len--;
        }

        if (len < 0) break;
        r += str[i];
    }

    return r;
};