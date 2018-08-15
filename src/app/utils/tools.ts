/**
 * common tools
 */
import { ArgonHash } from '../../pi/browser/argonHash';
import { popNew } from '../../pi/ui/root';
import { isNumber } from '../../pi/util/util';
import { BTCWallet } from '../core/btc/wallet';
import { Cipher } from '../core/crypto/cipher';
import { ibanToAddress, isValidIban } from '../core/eth/helper';
import { ERC20Tokens } from '../core/eth/tokens';
import { EthWallet } from '../core/eth/wallet';
import { toMnemonic } from '../core/genmnemonic';
import { GlobalWallet } from '../core/globalWallet';
import { dataCenter } from '../store/dataCenter';
import { Addr } from '../store/interface';
import { find, updateStore } from '../store/store';
import { lang, supportCurrencyList } from './constants';

export const depCopy = (v: any): any => {
    return JSON.parse(JSON.stringify(v));
};
// 这需要移除
export const setLocalStorage = (key: any, data: any, notified?: boolean) => {
    updateStore(key, data, notified);
};

// 这需要移除
export const getLocalStorage = (key: any) => {
    return find(key);
};
// 这需要移除
export const removeLocalStorage = (key: string) => {
    localStorage.removeItem(key);
};

export const sleep = (delay) => {
    const startTime = new Date().getTime();
    let loop = true;
    while (loop) {
        const endTime = new Date().getTime();
        if (endTime - startTime > delay) {
            loop = false;
        }
    }
};

/**
 * 获取指定id的钱包
 */
export const getWalletByWalletId = (wallets, walletId) => {
    if (!(wallets && wallets.length > 0)) return null;
    for (let i = 0; i < wallets.length; i++) {
        if (wallets[i].walletId === walletId) return wallets[i];
    }

    return null;
};

/**
 * 获取指定id钱包的index
 */
export const getWalletIndexByWalletId = (wallets, walletId) => {
    if (!(wallets && wallets.length > 0)) {
        return -1;
    }
    for (let i = 0; i < wallets.length; i++) {
        if (wallets[i].walletId === walletId) return i;
    }

    return -1;
};

/**
 * 获取当前钱包对应货币正在使用的地址信息
 * @param currencyName 货币类型
 */
export const getCurrentAddrInfo = (currencyName: string) => {
    const addrs = find('addrs');
    const wallet = find('curWallet');
    const currencyRecord = wallet.currencyRecords.filter(item => item.currencyName === currencyName)[0];
    // tslint:disable-next-line:no-unnecessary-local-variable
    const addrInfo = addrs.filter(item => item.addr === currencyRecord.currentAddr && item.currencyName === currencyName)[0];

    return addrInfo;
};
/**
 * 通过地址id获取地址信息
 * @param addrId  address id
 */
export const getAddrById = (addrId: string, currencyName: string): Addr => {
    const list: Addr[] = find('addrs') || [];

    return list.filter(v => v.addr === addrId && v.currencyName === currencyName)[0];
};

/**
 * 通过地址id重置地址
 * @param addrId address id
 * @param data  新地址
 * @param notified 是否通知数据发生改变 
 */
export const resetAddrById = (addrId: string, currencyName: string, data: Addr, notified?: boolean) => {
    let list: Addr[] = find('addrs') || [];
    list = list.map(v => {
        if (v.addr === addrId && v.currencyName === currencyName) return data;

        return v;
    });
    updateStore('addrs', list);
};

/**
 * 获取钱包下的所有地址
 * @param wallet wallet obj
 */
export const getAddrsAll = (wallet) => {
    const currencyRecords = wallet.currencyRecords;
    const retAddrs = [];
    currencyRecords.forEach((item) => {
        retAddrs.push(...item.addrs);
    });

    // 去除数组中重复的地址
    return [...new Set(retAddrs)];
};

/**
 * 获取钱包下指定货币类型的所有地址
 * @param wallet wallet obj
 */
export const getAddrsByCurrencyName = (wallet: any, currencyName: string) => {
    const currencyRecords = wallet.currencyRecords;
    const retAddrs = [];
    const len = currencyRecords.length;
    for (let i = 0; i < len; i++) {
        if (currencyRecords[i].currencyName === currencyName) {
            retAddrs.push(...currencyRecords[i].addrs);
            break;
        }
    }

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

// hash256
export const sha256 = (data: string) => {
    const cipher = new Cipher();

    return cipher.sha256(data);
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

    return `${str.slice(0, 8)}...${str.slice(str.length - 8, str.length)}`;
};

export const getDefaultAddr = (addr: number | string) => {
    const addrStr = addr.toString();

    return `${addrStr.slice(0, 3)}...${addrStr.slice(-3)}`;
};

/**
 * wei转Eth
 */
export const wei2Eth = (num: number) => {
    if (!num) return 0;

    return num / Math.pow(10, 18);
};

/**
 * wei转Eth
 */
export const eth2Wei = (num: number) => {
    if (!num) return 0;

    return num * Math.pow(10, 18);
};

/**
 * sat转btc
 */
export const sat2Btc = (num: number) => {
    if (!num) return 0;

    return num / Math.pow(10, 8);
};

/**
 * btc转sat
 */
export const btc2Sat = (num: number) => {
    if (!num) return 0;

    return num * Math.pow(10, 8);
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
 * 根据货币类型小单位转大单位
 */
export const smallUnit2LargeUnit = (currencyName: string, amount: number) => {
    if (currencyName === 'ETH') {
        return wei2Eth(amount);
    } else if (currencyName === 'KT') {
        return kpt2kt(amount);
    }
};

/**
 * 根据货币类型大单位转小单位
 */
export const largeUnit2SmallUnit = (currencyName: string, amount: number) => {
    if (currencyName === 'ETH') {
        return Math.floor(eth2Wei(amount));
    } else if (currencyName === 'KT') {
        return Math.floor(kt2kpt(amount));
    }
};

/**
 * 根据货币类型小单位转大单位  
 */
export const smallUnit2LargeUnitString = (currencyName: string, amount: string): number => {
    if (currencyName === 'ETH') {
        const pow = amount.length - 15;
        let num = Number(amount.slice(0, 15));
        num = wei2Eth(num);
        num = num * Math.pow(10, pow);

        return formatBalance(num);
    } else if (currencyName === 'KT') {
        return formatBalance(kpt2kt(Number(amount)));
    }
};

/**
 * 根据货币类型大单位转小单位
 */
export const largeUnit2SmallUnitString = (currencyName: string, amount: number): string => {
    if (currencyName === 'ETH') {
        return eth2Wei(amount).toLocaleString().replace(/,/g, '');
    } else if (currencyName === 'KT') {
        return kt2kpt(amount).toLocaleString().replace(/,/g, '');
    }
};

/**
 * eth 代币除以精度计算
 */
export const ethTokenDivideDecimals = (num: number, tokenName: string) => {
    const ERC20TokenDecimals = getLocalStorage('ERC20TokenDecimals') || {};
    const decimals = ERC20TokenDecimals[tokenName] ? ERC20TokenDecimals[tokenName] : Math.pow(10, 18);

    return num / decimals;
};
/**
 * eth 代币乘以精度计算
 */
export const ethTokenMultiplyDecimals = (num: number, tokenName: string) => {
    const ERC20TokenDecimals = getLocalStorage('ERC20TokenDecimals') || {};
    const decimals = ERC20TokenDecimals[tokenName] ? ERC20TokenDecimals[tokenName] : Math.pow(10, 18);

    return num * decimals;
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
    } else if (ERC20Tokens[currencyName]) {
        num = isMinUnit ? ethTokenDivideDecimals(!isNumber(perNum) ? perNum.toNumber() : perNum, currencyName) : perNum;
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
 * @param isWei 是否wei转化effectiveCurrencyNoConversion
 */
export const effectiveCurrencyNoConversion = (perNum: any, currencyName: string, isMinUnit: boolean) => {
    const r: any = { num: 0, show: '', conversionShow: '' };
    let num;
    if (currencyName === 'ETH') {
        num = isMinUnit ? wei2Eth(!isNumber(perNum) ? perNum.toNumber() : perNum) : perNum;
    } else if (currencyName === 'BTC') {
        num = isMinUnit ? sat2Btc(!isNumber(perNum) ? perNum.toNumber() : perNum) : perNum;
    } else if (ERC20Tokens[currencyName]) {
        num = isMinUnit ? ethTokenDivideDecimals(!isNumber(perNum) ? perNum.toNumber() : perNum, currencyName) : perNum;
    }
    r.num = num;
    r.show = `${formatBalance(num)} ${currencyName}`;

    return r;

};

/**
 * 获取有效的货币不需要转化
 * 
 * @param perNum 转化前数据
 * @param currencyName  当前货币类型
 * @param isMinUnit 是否是最小单位
 * 
 */
export const effectiveCurrencyStableConversion = (perNum: any, currencyName: string, conversionType: string, isMinUnit: boolean) => {
    const rate: any = dataCenter.getExchangeRate(currencyName);
    const r: any = { num: 0, conversionShow: '' };
    let num;
    if (currencyName === 'ETH') {
        num = isMinUnit ? wei2Eth(!isNumber(perNum) ? perNum.toNumber() : perNum) : perNum;
    } else if (currencyName === 'BTC') {
        num = isMinUnit ? sat2Btc(!isNumber(perNum) ? perNum.toNumber() : perNum) : perNum;
    } else if (ERC20Tokens[currencyName]) {
        num = isMinUnit ? ethTokenDivideDecimals(!isNumber(perNum) ? perNum.toNumber() : perNum, currencyName) : perNum;
    }
    r.num = num;
    r.conversionShow = (num * rate[conversionType]).toFixed(2);

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
 * 转化显示时间格式为‘04-30 14:32:00’
 */
export const transDate = (t: Date) => {
    // tslint:disable-next-line:max-line-length
    return `${addPerZero(t.getUTCMonth() + 1, 2)}-${addPerZero(t.getUTCDate(), 2)} ${addPerZero(t.getHours(), 2)}:${addPerZero(t.getMinutes(), 2)}:${addPerZero(t.getSeconds(), 2)}`;
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

/**
 * 获取新的地址信息
 * @param currencyName 货币类型
 */
export const getNewAddrInfo = (currencyName, mnemonic, wallet) => {
    const currencyRecord = wallet.currencyRecords.filter(v => v.currencyName === currencyName)[0];
    if (!currencyRecord) return;
    const addrs = find('addrs');
    const firstAddr = addrs.filter(v => v.addr === currencyRecord.addrs[0])[0];

    let address;
    if (currencyName === 'ETH' || ERC20Tokens[currencyName]) {
        const wlt = EthWallet.fromJSON(firstAddr.wlt);
        const newWlt = wlt.selectAddressWlt(currencyRecord.addrs.length);
        address = newWlt.address;
    } else if (currencyName === 'BTC') {
        const wlt = BTCWallet.fromJSON(firstAddr.wlt);
        wlt.unlock();
        address = wlt.derive(currencyRecord.addrs.length);
        wlt.lock();

    }

    return address;
};

/**
 * 添加新的地址
 * @param currencyName 货币类型
 * @param address 新的地址
 * @param addrName 新的地址名
 * @param wltJson 新的地址钱包对象
 */
export const addNewAddr = (currencyName, address, addrName) => {
    const wallet = find('curWallet');
    const currencyRecord = wallet.currencyRecords.filter(v => v.currencyName === currencyName)[0];
    if (!currencyRecord) return;
    currencyRecord.addrs.push(address);
    const addrs: Addr[] = find('addrs') || [];
    const newAddrInfo: Addr = dataCenter.initAddr(address, currencyName, addrName);
    addrs.push(newAddrInfo);
    currencyRecord.currentAddr = address;

    dataCenter.addAddr(address, addrName, currencyName);

    updateStore('addrs', addrs);
    updateStore('curWallet', wallet);

    return newAddrInfo;
};

// 函数防抖
export const debounce = (fn, wait = 1000) => {
    let timer = null;

    return (...rest) => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(() => {
            fn(...rest);
        }, wait);
    };
};

/**
 * 是否是有效地址
 * @param currencyName 货币类型
 * @param addr 地址
 */
export const effectiveAddr = (currencyName: string, addr: string): [boolean, string] => {
    let flag = false;
    if (currencyName === 'ETH') {
        // 0xa6e83b630bf8af41a9278427b6f2a35dbc5f20e3
        // alert(addr);
        const per = 'iban:';
        if (addr.indexOf(per) === 0) {
            const lastIndex = addr.indexOf('?');
            addr = lastIndex >= 0 ? addr.slice(per.length, lastIndex) : addr.slice(per.length);
            if (isValidIban(addr)) {
                addr = ibanToAddress(addr);
            }
        }
        flag = addr.indexOf('0x') === 0 && addr.length === 42;
    } else if (currencyName === 'BTC') {
        // alert(addr);
        const per = 'bitcoin:';
        if (addr.indexOf(per) === 0) {
            const lastIndex = addr.indexOf('?');
            addr = lastIndex >= 0 ? addr.slice(per.length, lastIndex) : addr.slice(per.length);
        }
        // alert(addr.length);
        // mw8VtNKY81RjLz52BqxUkJx57pcsQe4eNB
        flag = addr.length === 34;
    }

    return [flag, addr];
};

/**
 * 解析url中指定key的值
 * @param url url地址
 * @param key 键
 */
export const urlParams = (url: string, key: string) => {
    const ret = url.match(new RegExp(`(\\?|&)${key}=(.*?)(&|$)`));

    return ret && decodeURIComponent(ret[2]);
};

/**
 * 金额格式化
 * @param banlance 金额
 */
export const formatBalance = (banlance: number) => {
    if (!banlance) return 0;

    return Number(banlance.toFixed(6));
};

/**
 * 字符串转u8Arr
 * 
 * @param str 输入字符串
 */
export const str2arr = (str) => {
    const len = str.length;
    const arr = [];
    let arr32;
    let i;
    let offset = 0;
    if (len >= 32) {
        for (i = 0; i < 8; i++) {
            arr[i] = ((str.charCodeAt(i * 4) & 0xff) << 24)
                | ((str.charCodeAt(i * 4 + 1) & 0xff) << 16)
                | ((str.charCodeAt(i * 4 + 2) & 0xff) << 8)
                | (str.charCodeAt(i * 4 + 3) & 0xff);
        }
    }
    arr32 = new Uint32Array(new ArrayBuffer(32));
    for (i = 0; i < 8; i++) {
        arr32[i] = arr[offset++];
    }

    return new Uint8Array(arr32.buffer, 0, 32);
};
/**
 * u16Arr转字符串
 * 
 * @param buf 输入buff
 */
export const ab2str = (buf) => {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
};

/**
 * 字符串转u16Arr
 * 
 * @param str 输入字符串
 */
export const str2ab = (str) => {
    const buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    const bufView = new Uint16Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }

    return buf;
};

/**
 * 字节数组转十六进制字符串
 * @param arr 传入数组
 */
export const bytes2Str = (arr) => {
    let str = '';
    for (let i = 0; i < arr.length; i++) {
        let tmp = arr[i].toString(16);
        if (tmp.length === 1) {
            tmp = `0${tmp}`;
        }
        str += tmp;
    }

    return str;
};

/**
 * 十六进制字符串转字节数组
 * @param str 传入字符串
 */
export const str2Bytes = (str) => {
    let pos = 0;
    let len = str.length;
    if (len % 2 !== 0) return null;

    len /= 2;
    const hexA = [];
    for (let i = 0; i < len; i++) {
        const s = str.substr(pos, 2);
        const v = parseInt(s, 16);
        hexA.push(v);
        pos += 2;
    }

    return hexA;
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
 * 简化加密助记词
 * 
 * @param cipherMnemonic 加密助记词
 */
export const simplifyCipherMnemonic = (cipherMnemonic: string) => {
    const r = JSON.parse(cipherMnemonic);
    const newJson = { iv: r.iv, ct: r.ct, salt: r.salt };

    return JSON.stringify(newJson);
};

/**
 * 还原加密助记词
 * 
 * @param cipherMnemonic 加密助记词
 */
export const reductionCipherMnemonic = (cipherMnemonic: string) => {
    const r = JSON.parse(cipherMnemonic);
    const newJson = {
        iv: r.iv, ct: r.ct, salt: r.salt, v: 1, iter: 10000, ks: 128, ts: 64
        , mode: 'ccm', adata: '', cipher: 'aes', keySize: 128, tagSize: 64
    };

    return JSON.stringify(newJson);
};

/**
 * 余额格式化
 */
export const formatBalanceValue = (value: number) => {
    return value.toFixed(2);
};

/**
 * 获取总资产
 */
export const fetchTotalAssets = () => {
    const wallet = find('curWallet');
    if (!wallet) return;
    let totalAssets = 0;
    wallet.currencyRecords.forEach(item => {
        const balance = fetchBalanceOfCurrency(item.addrs, item.currencyName);
        totalAssets += balance * dataCenter.getExchangeRate(item.currencyName).CNY;
    });

    return totalAssets;
};

/**
 * 获取指定货币下余额总数
 * @param addrs 指定货币下的地址
 * @param currencyName 货币名称
 */
export const fetchBalanceOfCurrency = (addrs: string[], currencyName: string) => {
    const localAddrs = find('addrs');
    let balance = 0;
    localAddrs.forEach(item => {
        if (addrs.indexOf(item.addr) >= 0 && item.currencyName === currencyName) {
            balance += item.balance;
        }
    });

    return balance;
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
 * 验证身份
 */
export const VerifyIdentidy = async (wallet, passwd, useCache: boolean = true) => {
    const hash = await calcHashValuePromise(passwd, find('salt'), wallet.walletId, useCache);
    const gwlt = GlobalWallet.fromJSON(wallet.gwlt);

    try {
        const cipher = new Cipher();
        const r = cipher.decrypt(hash, gwlt.vault);
        // console.log('VerifyIdentidy hash', hash, gwlt.vault, passwd, r);

        dataCenter.setHash(wallet.walletId, hash);

        return true;
    } catch (error) {
        console.log(error);

        return false;
    }
};

/**
 * 获取助记词
 */
export const getMnemonic = async (wallet, passwd) => {
    const hash = await calcHashValuePromise(passwd, find('salt'), wallet.walletId);
    const gwlt = GlobalWallet.fromJSON(wallet.gwlt);
    try {
        const cipher = new Cipher();
        const r = cipher.decrypt(hash, gwlt.vault);

        dataCenter.setHash(wallet.walletId, hash);

        return toMnemonic(lang, hexstrToU8Array(r));
    } catch (error) {
        console.log(error);

        return '';
    }
};
/**
 * 获取助记词16进制字符串
 */
export const getMnemonicHexstr = async (wallet, passwd) => {
    const hash = await calcHashValuePromise(passwd, find('salt'), wallet.walletId);
    const gwlt = GlobalWallet.fromJSON(wallet.gwlt);
    try {
        const cipher = new Cipher();
        const r = cipher.decrypt(hash, gwlt.vault);

        dataCenter.setHash(wallet.walletId, hash);

        return r;
    } catch (error) {
        console.log(error);

        return '';
    }
};
// 锁屏密码验证
export const lockScreenVerify = (psw) => {
    const hash256 = sha256(psw + find('salt'));
    const localHash256 = find('lockScreen').psw;

    return hash256 === localHash256;
};
// 锁屏密码hash算法
export const lockScreenHash = (psw) => {
    return sha256(psw + find('salt'));
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

/**
 * 获取memery hash
 */
export const calcHashValuePromise = async (pwd, salt, walletId, useCache: boolean = true) => {
    let hash;
    if (useCache && walletId) {
        hash = find('hashMap',walletId);
        if (hash) return hash;
    }

    const argonHash = new ArgonHash();
    argonHash.init();
    // tslint:disable-next-line:no-unnecessary-local-variable
    hash = await argonHash.calcHashValuePromise({ pwd, salt });

    return hash;
};

/**
 * 基础打开弹窗界面封装
 */
export const openBasePage = (foreletName: string, foreletParams: any = {}): Promise<string> => {
    // this.windowConfig = windowconfig || this.windowConfig;
    // if (!foreletName || foreletName === '') {
    //     console.warn(`openModal foreletName is fail:${foreletName}`);

    //     return;
    // }

    // // 单例模式
    // if (this.windowConfig && this.windowConfig.model === 'single' && this.windowSet.has(foreletName)) {
    //     console.info(`窗口${foreletName}已经创建，阻止重复创建`);

    //     return;
    // }  else {
    //     this.windowSet.add(foreletName);
    // }

    // tslint:disable-next-line:typedef
    return new Promise((resolve, reject) => {
        popNew(foreletName, foreletParams, (ok: string) => {
            // this.windowSet.delete(foreletName);
            resolve(ok);
        }, (cancel: string) => {
            // this.windowSet.delete(foreletName);
            reject(cancel);
        });

    });
};

// 计算字符串长度包含中文 中文长度加2 英文加1
export const getByteLen = (val) => {
    let len = 0;
    for (let i = 0; i < val.length; i++) {
        const a = val.charAt(i);
        if (a.match(/[^\x00-\xff]/ig) !== null) {
            len += 2;
        } else {
            len += 1;
        }
    }

    return len;
};

// 计算支持的币币兑换的币种
export const currencyExchangeAvailable = () => {
    const shapeshiftCoins = find('shapeShiftCoins');
    const currencyArr = [];
    for (let i = 0; i < supportCurrencyList.length; i++) {
        currencyArr.push(supportCurrencyList[i].name);
    }

    return shapeshiftCoins.filter(item => {
        return item.status === 'available' && currencyArr.indexOf(item.symbol) >= 0;
    });
};

// 根据货币名获取当前正在使用的地址
export const getCurrentAddrByCurrencyName = (currencyName: string) => {
    const wallet = find('curWallet');
    const currencyRecords = wallet.currencyRecords;
    let curAddr = '';

    for (let i = 0; i < currencyRecords.length; i++) {
        if (currencyRecords[i].currencyName === currencyName) {
            curAddr = currencyRecords[i].currentAddr;
            break;
        }
    }

    return curAddr;
};

// 根据货币名获取当前正在使用的地址的余额
export const getCurrentAddrBalanceByCurrencyName = (currencyName: string) => {
    const curAddr = getCurrentAddrByCurrencyName(currencyName);
    console.log('curAddr',curAddr);
    const addrs = find('addrs');
    for (let i = 0; i < addrs.length; i++) {
        if ((addrs[i].currencyName === currencyName) && (addrs[i].addr === curAddr)) {
            return addrs[i].balance;
        }
    }
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

// 获取当前钱包第一个ETH地址
export const getFirstEthAddr = () => {
    const wallet = find('curWallet');
    if (!wallet) return;
    const currencyRecords = wallet.currencyRecords;
    for (let i = 0; i < currencyRecords.length; i++) {
        if (currencyRecords[i].currencyName === 'ETH') {
            return currencyRecords[i].addrs[0];
        }
    }
};

// unicode数组转字符串
export const unicodeArray2Str = (arr) => {
    let str = '';
    for (let i = 0; i < arr.length; i++) {
        str += String.fromCharCode(arr[i]);
    }

    return str;
};

/**
 * 添加交易记录到本地
 */
export const addRecord = (currencyName, currentAddr, record) => {
    const addr = getAddrById(currentAddr, currencyName);
    if (!addr) return;
    addr.record.push(record);

    resetAddrById(currentAddr, currencyName, addr, true);
};