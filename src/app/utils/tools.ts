/**
 * common tools
 */
import { ArgonHash } from '../../pi/browser/argonHash';
import { popNew } from '../../pi/ui/root';
import { ERC20Tokens, MainChainCoin } from '../config';
import { Cipher } from '../core/crypto/cipher';
import { uploadFileUrlPrefix } from '../net/pull';
import { Addr, CurrencyType, CurrencyTypeReverse, LanguageSet, MinerFeeLevel, TransRecordLocal, TxStatus, TxType } from '../store/interface';
import { find, getBorn, updateStore } from '../store/store';
import { currencyConfirmBlockNumber, defalutShowCurrencys } from './constants';

export const depCopy = (v: any): any => {
    return JSON.parse(JSON.stringify(v));
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
export const resetAddrById = (addrId: string, currencyName: string, data: Addr) => {
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

/**
 * 获取钱包下指定货币类型的所有地址信息
 * @param wallet wallet obj
 */
export const getAddrsInfoByCurrencyName = (currencyName: string) => {
    const wallet = find('curWallet');
    const currencyRecords = wallet.currencyRecords;
    const retAddrInfo = [];
    const len = currencyRecords.length;
    for (let i = 0; i < len; i++) {
        if (currencyRecords[i].currencyName === currencyName) {
            for (let j = 0;j < currencyRecords[i].addrs.length; j++) {
                const addr = currencyRecords[i].addrs[j];
                const obj = {
                    addr,
                    balance:getAddrInfoByAddr(addr,currencyName).balance
                };
                retAddrInfo.push(obj);
            }
            break;
        }
    }

    return retAddrInfo;
};

/**
 * 通过地址获取地址余额
 */
export const getAddrInfoByAddr = (addr: string, currencyName: string) => {
    const addrs = find('addrs') || [];

    return addrs.filter(v => v.addr === addr && v.currencyName === currencyName)[0];
};

// 随机生成RGB颜色
export const randomRgbColor = () => { 
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
 * 余额格式化
 */
export const formatBalanceValue = (value: number) => {
    return value.toFixed(2);
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
 * 获取指定货币下余额总数
 * @param currencyName 货币名称
 */
export const fetchBalanceOfCurrency = (currencyName: string) => {
    const wallet = find('curWallet');
    if (!wallet) return 0;
    const localAddrs = find('addrs');
    let balance = 0;
    let addrs = [];
    for (let i = 0; i < wallet.currencyRecords.length;i++) {
        if (wallet.currencyRecords[i].currencyName === currencyName) {
            addrs = wallet.currencyRecords[i].addrs;
            break;
        }
    }
    localAddrs.forEach(item => {
        if (addrs.indexOf(item.addr) >= 0 && item.currencyName === currencyName) {
            balance += item.balance;
        }
    });

    return balance;
};

/**
 * 获取总资产
 */
export const fetchTotalAssets = () => {
    const wallet = find('curWallet');
    if (!wallet) return 0;
    let totalAssets = 0;
    wallet.currencyRecords.forEach(item => {
        if (wallet.showCurrencys.indexOf(item.currencyName) >= 0) {
            const balance = fetchBalanceOfCurrency(item.currencyName);
            totalAssets += balance * find('exchangeRateJson',item.currencyName).CNY;
        }
        
    });

    return totalAssets;
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
export const calcHashValuePromise = async (pwd, salt?) => {
    let hash;

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

export const popPswBox = async (content= []) => {
    try {
        // tslint:disable-next-line:no-unnecessary-local-variable
        const psw = await openMessageboxPsw(content);

        return psw;
    } catch (error) {
        return;
    }
};

// 弹出提示框
export const popNewMessage = (content:string) => {
    return popNew('app-components-message-message',{ content });
};
// 弹出loading
export const popNewLoading = (text:string) => {
    return popNew('app-components1-loading-loading',{ text });
};

/**
 * 打开密码输入框
 */
const openMessageboxPsw = (content?): Promise<string> => {
    // tslint:disable-next-line:typedef
    return new Promise((resolve, reject) => {
        popNew('app-components-modalBoxInput-modalBoxInput', { itype:'password',title:'请输入密码',content }, (r: string) => {
            resolve(r);
        }, (cancel: string) => {
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
    for (const i in MainChainCoin) {
        currencyArr.push(i);
    }
    for (const i in ERC20Tokens) {
        currencyArr.push(i);
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
            return addrs[i].balance || 0;
        }
    }

    return 0;
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
    if (!arr || arr === 'null') {
        return str;
    }
    for (let i = 0; i < arr.length; i++) {
        str += String.fromCharCode(arr[i]);
    }

    return str;
};

/**
 * 计算日期间隔
 */
export const GetDateDiff = (startDate,endDate) => {
    let Y =   `${startDate.getFullYear()}-`;
    let M =   `${(startDate.getMonth() + 1 < 10 ? `0${(startDate.getMonth() + 1)}` : startDate.getMonth() + 1)}-`;
    let D = `${startDate.getDate()}`;
    startDate = new Date(`${Y}${M}${D}`); 
    const startTime = startDate.getTime();  
    Y =   `${endDate.getFullYear()}-`;
    M =   `${(endDate.getMonth() + 1 < 10 ? `0${(endDate.getMonth() + 1)}` : endDate.getMonth() + 1)}-`;
    D = `${endDate.getDate()}`;
    endDate = new Date(`${Y}${M}${D}`); 
    const endTime = endDate.getTime();

    return  Math.floor(Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24));    
};

// 时间戳格式化 毫秒为单位
export const timestampFormatToDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : `0${date.getMonth() + 1}`;
    const day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`;
    
    return `${year}-${month}-${day}`;
};
/**
 * 密码加密
 * @param plainText 需要加密的文本
 */
export const encrypt = (plainText: string,salt:string) => {
    const cipher = new Cipher();

    return cipher.encrypt(salt, plainText);
};

/**
 * 密码解密
 * @param cipherText 需要解密的文本
 */
export const decrypt = (cipherText: string,salt:string) => {
    const cipher = new Cipher();

    return cipher.decrypt(salt, cipherText);
};

// hash256;
export const sha256 = (data: string) => {
    const cipher = new Cipher();

    return cipher.sha256(data);
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

// ==========================================================new version tools

// 获取gasPrice
export const fetchGasPrice = (minerFeeLevel:MinerFeeLevel) => {
    return find('gasPrice')[minerFeeLevel];
};

// 获取btc miner fee
export const fetchBtcMinerFee = (minerFeeLevel:MinerFeeLevel) => {
    return find('btcMinerFee')[minerFeeLevel];
};

// 获取默认币种汇率
export const fetchDefaultExchangeRateJson = () => {
    const rateJson = new Map<string,any>();
    // 主链汇率
    for (const k in MainChainCoin) {
        if (MainChainCoin.hasOwnProperty(k)) {
            rateJson.set(k,MainChainCoin[k].rate);
        }
    }
    // erc20汇率
    for (const k in ERC20Tokens) {
        if (ERC20Tokens.hasOwnProperty(k)) {
            rateJson.set(k,ERC20Tokens[k].rate);
        }
    }

    return rateJson;
};

/**
 * 获取本地钱包资产列表
 */
export const fetchWalletAssetList = () => {
    const coinGain = getBorn('coinGain');
    const wallet = find('curWallet');
    const showCurrencys = (wallet && wallet.showCurrencys) || defalutShowCurrencys;
    const assetList = [];
    for (const k in MainChainCoin) {
        const item:any = {};
        if (MainChainCoin.hasOwnProperty(k) && showCurrencys.indexOf(k) >= 0 && k !== 'KT') {
            item.currencyName = k;
            item.description = MainChainCoin[k].description;
            const balance = fetchBalanceOfCurrency(k);
            const cny = getBorn('exchangeRateJson').get(k).CNY;
            item.balance = formatBalance(balance);
            item.balanceValue = formatBalanceValue(balance * cny);
            item.gain =  coinGain.get(k) || formatBalanceValue(0);
            assetList.push(item);
        }
        
    }

    for (const k in ERC20Tokens) {
        const item:any = {};
        if (ERC20Tokens.hasOwnProperty(k) && showCurrencys.indexOf(k) >= 0) {
            item.currencyName = k;
            item.description = ERC20Tokens[k].description;
            const balance = fetchBalanceOfCurrency(k);
            const cny = getBorn('exchangeRateJson').get(k).CNY;
            item.balance = formatBalance(balance);
            item.balanceValue = formatBalanceValue(balance * cny);
            item.gain =  coinGain.get(k) || formatBalanceValue(0);
            assetList.push(item);
        }
    }

    return assetList;
};

/**
 * 获取云端钱包资产列表
 */
export const fetchCloudWalletAssetList = () => {
    const coinGain = getBorn('coinGain');
    const assetList = [];
    for (const k in CurrencyType) {
        const item:any = {};
        if (MainChainCoin.hasOwnProperty(k)) {
            item.currencyName = k;
            item.description = MainChainCoin[k].description;
            const balance = getBorn('cloudBalance').get(CurrencyType[k]) || 0;
            const cny = getBorn('exchangeRateJson').get(k).CNY;
            item.balance = formatBalance(balance);
            item.balanceValue = formatBalanceValue(balance * cny);
            item.gain =  coinGain.get(k) || formatBalanceValue(0);
            assetList.push(item);
        }
        
    }

    return assetList;
};

/**
 * 获取云端总资产
 */
export const fetchCloudTotalAssets = () => {
    const cloudBalance = getBorn('cloudBalance');
    let totalAssets = 0;
    for (const [k,v] of cloudBalance) {
        totalAssets += v * find('exchangeRateJson',CurrencyTypeReverse[k]).CNY;
    }

    return totalAssets;
};

/**
 * 没有创建钱包时
 */
export const hasWallet = () => {
    const wallet = find('curWallet');
    if (!wallet) {
        popNew('app-components-modalBox-modalBox',{ 
            title:'提示',
            content:'你还没有登录，去登录使用更多功能吧',
            sureText:'去登录',
            cancelText:'暂时不' 
        },() => {
            popNew('app-view-wallet-create-home');
        });

        return false;
    }

    return true;
};

// 解析交易状态
export const parseStatusShow = (tx:TransRecordLocal) => {
    if(!tx){
        return {
            text:'打包中',
            icon:'pending.png'
        }; 
    }
    const status = tx.status;
    if (status === TxStatus.PENDING) {
        return {
            text:'打包中',
            icon:'pending.png'
        };
    } else if (status === TxStatus.CONFIRMED) {
        return {
            text:`已确认 ${tx.confirmedBlockNumber}/${tx.needConfirmedBlockNumber}`,
            icon:'pending.png'
        };
    } else if (status === TxStatus.FAILED) {
        return {
            text:'交易失败',
            icon:'fail.png'
        };
    } else {
        return {
            text:'已完成',
            icon:'icon_right2.png'
        };
    }
};

// 解析转账类型
export const parseTxTypeShow = (txType:TxType) => {
    if (txType === TxType.RECEIPT) {
        return '收款';
    }

    return '转账';
};

 // 解析是否可以重发
export const canResend = (tx) => {
    if (tx.status !== TxStatus.PENDING) return false;
    if (tx.minerFeeLevel === MinerFeeLevel.FASTEST) return false;

    return true;
};

/**
 * 获取钱包资产列表是否添加
 */
export const fetchWalletAssetListAdded = () => {
    const wallet = find('curWallet');
    const showCurrencys = (wallet && wallet.showCurrencys) || defalutShowCurrencys;
    const assetList = [];
    for (const k in MainChainCoin) {
        const item:any = {};
        if (MainChainCoin.hasOwnProperty(k) && k !== 'KT') {
            item.currencyName = k;
            item.description = MainChainCoin[k].description;
            if (showCurrencys.indexOf(k) >= 0) {
                item.added = true;
            } else {
                item.added = false;
            }
            if (defalutShowCurrencys.indexOf(k) >= 0) {
                item.canSwtiched = false;
            } else {
                item.canSwtiched = true;
            }
            assetList.push(item);
        }
        
    }

    for (const k in ERC20Tokens) {
        const item:any = {};
        if (ERC20Tokens.hasOwnProperty(k)) {
            item.currencyName = k;
            item.description = ERC20Tokens[k].description;
            if (showCurrencys.indexOf(k) >= 0) {
                item.added = true;
            } else {
                item.added = false;
            }
            if (defalutShowCurrencys.indexOf(k) >= 0) {
                item.canSwtiched = false;
            } else {
                item.canSwtiched = true;
            }
            assetList.push(item);
        }
    }

    return assetList;
};

/**
 * 初始化地址对象
 */
export const initAddr = (address: string, currencyName: string, addrName?: string): Addr => {
    return {
        addr: address,
        addrName: addrName || getDefaultAddr(address),
        record: [],
        balance: 0,
        currencyName: currencyName
    };
};

// 获取货币的涨跌情况
export const fetchCoinGain = () => {
    const coinGain = getBorn('coinGain');
    for (const k in MainChainCoin) {
        const item:any = {};
        if (MainChainCoin.hasOwnProperty(k)) {
            const gain = Math.random();
            item.gain =  gain > 0.5 ? formatBalanceValue(gain) : formatBalanceValue(-gain);
            coinGain.set(k,item.gain);
        }
        
    }

    for (const k in ERC20Tokens) {
        const item:any = {};
        if (ERC20Tokens.hasOwnProperty(k)) {
            const gain = Math.random();
            item.gain =  gain > 0.5 ? formatBalanceValue(gain) : formatBalanceValue(-gain);
            coinGain.set(k,item.gain);
        }
    }
};
/**
 * 转化rtype
 */
export const parseRtype = (rType) => {
    if (rType === 0) return '普通红包';
    if (rType === 1) return '随机红包';
    if (rType === 99) return '邀请红包';

    return '';
};
/**
 * 获取某id理财产品持有量，不算已经赎回的
 */
export const fetchHoldedProductAmount = (id:string) => {
    const purchaseRecord = find('purchaseRecord');
    let holdAmout = 0;
    for (let i = 0;i < purchaseRecord.length;i++) {
        const one = purchaseRecord[i];
        if (one.id === id && one.state === 1) {
            holdAmout += one.amount;
        }
    }

    return holdAmout;
};

/**
 * 计算剩余百分比
 */
export const calPercent = (surplus:number,total:number) => {
    if (surplus === 0) {
        return {
            left:0,
            use:100
        };
    }
    if (surplus === total) {
        return {
            left:100,
            use:0
        };
    }
    if (surplus <= total / 100) {
        return {
            left:1,
            use:99
        };
    }
    const r = Number((surplus / total).toString().slice(0,4));

    return {
        left:r * 100,
        use:100 - r * 100
    };
};

/**
 * base64 to blob
 */
export const base64ToBlob = (base64:string) => {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
};
/**
 * 图片base64转file格式
 */
export const base64ToFile = (base64:string) => {
    const blob = base64ToBlob(base64);
    const newFile = new File([blob], 'avatar.jpeg', { type: blob.type });
    console.log(newFile);

    return newFile;
};

/**
 * 获取用户基本信息
 */
export const getUserInfo = () => {
    const userInfo = find('userInfo');
    let nickName = userInfo.nickName;
    if(!nickName){
        const wallet = find('curWallet');
        if(wallet){
            nickName = JSON.parse(wallet.gwlt).nickName;
        }
    }
    let avatar = userInfo.avatar;
    if (avatar && avatar.indexOf('data:image') < 0) {
        avatar = `${uploadFileUrlPrefix}${avatar}`;
    }

    return {
        nickName,
        avatar
    };
};

/**
 * 获取区块确认数
 */
export const getConfirmBlockNumber = (currencyName:string,amount:number) => {
    if (ERC20Tokens[currencyName]) {
        return currencyConfirmBlockNumber.ERC20;
    }
    const confirmBlockNumbers = currencyConfirmBlockNumber[currencyName];
    for (let i = 0;i < confirmBlockNumbers.length;i++) {
        if (amount < confirmBlockNumbers[i].value) {
            return confirmBlockNumbers[i].number;
        }
    }
};

/**
 * 获取设备唯一id
 */
export const fetchDeviceId = () => {

    return getFirstEthAddr();
};

/**
 * 获取语言设置
 */
export const getLanguage = (w) => {
    const lan = find('languageSet');
    if (lan) {
        return w.config.value[lan.languageList[lan.selected]];
    }
    
    return w.config.value.simpleChinese;
};


/**
 * 助记词片段分享加密
 * 为了便于识别用户使用的是同一组密钥，会在分享出去的密钥的第2/4/6/8/10/12加上一个相同的随机数
 */
export const mnemonicFragmentEncrypt = (fragments:string[])=>{
    const len = 6;
    const randomArr = [];
    for(let i = 0;i < len;i++){
        const random = Math.floor(Math.random() * 10);
        randomArr.push(random);
    }
    const retFragments = [];
    for(let i = 0;i < fragments.length;i ++){
        const fragmentArr = fragments[i].split("");
        let j = 1;
        while(2 * j <= 12){
            fragmentArr.splice(2 * j - 1,0,randomArr[j - 1]);
            j++;
        }
        retFragments.push(fragmentArr.join(""));
    }
    return retFragments;
}

/**
 * 助记词片段分享解密
 * 为了便于识别用户使用的是同一组密钥，会在分享出去的密钥的第2/4/6/8/10/12加上一个相同的随机数
 */
export const mnemonicFragmentDecrypt = (fragment:string)=>{
    const fragmentArr = fragment.split("");
    const randomArr = [];
    let j = 6;
    while(j > 0){
        const delRandom = fragmentArr.splice(2 * j - 1,1);
        j--;
        randomArr.push(delRandom);
    }
    return {
        fragment:fragmentArr.join(""),
        randomStr:randomArr.reverse().join("")
    }
}