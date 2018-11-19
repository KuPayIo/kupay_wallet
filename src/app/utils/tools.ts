/**
 * common tools
 */
import { ArgonHash } from '../../pi/browser/argonHash';
import { closeCon, setBottomLayerReloginMsg } from '../../pi/net/ui/con_mgr';
import { popNew } from '../../pi/ui/root';
import { getLang } from '../../pi/util/lang';
import { cryptoRandomInt } from '../../pi/util/math';
import { Config, ERC20Tokens, MainChainCoin } from '../config';
import { Cipher } from '../core/crypto/cipher';
import { getDeviceId } from '../logic/native';
import { openConnect, uploadFileUrlPrefix } from '../net/pull';
// tslint:disable-next-line:max-line-length
import { AddrInfo, CloudCurrencyType, Currency2USDT, CurrencyRecord, MinerFeeLevel, TxHistory, TxStatus, TxType, User, Wallet } from '../store/interface';
import { Account, getCloudBalances, getStore, initCloudWallets, LocalCloudWallet, setStore } from '../store/memstore';
// tslint:disable-next-line:max-line-length
import { currencyConfirmBlockNumber, defalutShowCurrencys, defaultGasLimit, notSwtichShowCurrencys, resendInterval, timeOfArrival } from './constants';
import { sat2Btc, wei2Eth } from './unitTools';

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
    const wallet = getStore('wallet');
    for (const record of wallet.currencyRecords) {
        if (record.currencyName === currencyName) {
            for (const addrInfo of record.addrs) {
                if (addrInfo.addr === record.currentAddr) {
                    return addrInfo;
                }
            }
        }
    }

    return;
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
    const wallet = getStore('wallet');
    for (const record of wallet.currencyRecords) {
        if (record.currencyName === currencyName) {
            return record.addrs;
        }
    }
};

/**
 * 通过地址获取地址余额
 */
export const getAddrInfoByAddr = (addr: string, currencyName: string) => {
    const wallet = getStore('wallet');
    for (const record of wallet.currencyRecords) {
        if (record.currencyName === currencyName) {
            for (const addrInfo of record.addrs) {
                if (addrInfo.addr === addr) {
                    return addrInfo;
                }
            }
        }
    }
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

    return `${str.slice(0, 6)}...${str.slice(str.length - 6, str.length)}`;
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
// ArrayBuffer转16进度字符串示例
export const ab2hex = (buffer) => {
    const hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
       (bit) => {
           return ('00' + bit.toString(16)).slice(-2);
       }
    );
    return hexArr.join('');
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
 * 十六进制字符串转u8数组
 * 
 * @param str 输入字符串
 */
export const hexstrToU16Array = (str: string) => {
    // if (str.length % 2 > 0) str = `0${str}`;

    const r = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
        r[i] = parseInt(str.charAt(i), 16);
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
    const wallet = getStore('wallet');
    if (!wallet) return 0;
    let balance = 0;
    let currencyRecord = null;
    for (const item of wallet.currencyRecords) {
        if (item.currencyName === currencyName) {
            currencyRecord = item;
        }
    }
    for (const addrInfo of currencyRecord.addrs) {
        balance += addrInfo.balance;
    }

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

// 复制到剪切板
export const copyToClipboard = (copyText) => {
    const input = document.createElement('input');
    input.setAttribute('readonly', 'readonly');
    input.setAttribute('value', copyText);
    input.setAttribute('style', 'position:absolute;top:-9999px;');
    document.body.appendChild(input);
    if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
        input.setSelectionRange(0, 9999);
    } else {
        input.select();
    }
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
    hash = await argonHash.calcHashValuePromise({ pwd, salt });
    setStore('user/secretHash',hash);

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

export const popPswBox = async (content = []) => {
    try {
        // tslint:disable-next-line:no-unnecessary-local-variable
        const BoxInputTitle = Config[getLang()].userInfo.PswBoxInputTitle;
        // tslint:disable-next-line:no-unnecessary-local-variable
        const psw = await openMessageboxPsw(BoxInputTitle,content);

        return psw;
    } catch (error) {
        return;
    }
};

// 弹出提示框
export const popNewMessage = (content: any) => {
    return popNew('app-components1-message-message', { content });
};
// 弹出loading
export const popNewLoading = (text: any) => {
    return popNew('app-components1-loading-loading', { text });
};

/**
 * 打开密码输入框
 */
const openMessageboxPsw = (BoxInputTitle?,content?): Promise<string> => {
    // tslint:disable-next-line:typedef
    return new Promise((resolve, reject) => {
        popNew('app-components1-modalBoxInput-modalBoxInput', { itype: 'password', title: BoxInputTitle, content }, (r: string) => {
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
    const shapeshiftCoins = getStore('third/shapeShiftCoins', []);
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
    const wallet = getStore('wallet');
    for (const record of wallet.currencyRecords) {
        if (record.currencyName === currencyName) {
            return record.currentAddr;
        }
    }

    return;
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
/**
 * 密码加密
 * @param plainText 需要加密的文本
 */
export const encrypt = (plainText: string, salt: string) => {
    const cipher = new Cipher();

    return cipher.encrypt(salt, plainText);
};

/**
 * 密码解密
 * @param cipherText 需要解密的文本
 */
export const decrypt = (cipherText: string, salt: string) => {
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
    const hash256 = sha256(psw + getStore('user/salt'));
    const localHash256 = getStore('setting/lockScreen').psw;

    return hash256 === localHash256;
};
// 锁屏密码hash算法
export const lockScreenHash = (psw) => {
    return sha256(psw + getStore('user/salt'));
};

// ==========================================================new version tools

// 获取gasPrice
export const fetchGasPrice = (minerFeeLevel: MinerFeeLevel) => {
    return getStore('third/gasPrice')[minerFeeLevel];
};

// 获取btc miner fee
export const fetchBtcMinerFee = (minerFeeLevel: MinerFeeLevel) => {
    return getStore('third/btcMinerFee')[minerFeeLevel];
};

/**
 * 获取总资产
 */
export const fetchLocalTotalAssets = () => {
    const wallet = getStore('wallet');
    if (!wallet) return 0;
    let totalAssets = 0;
    wallet.currencyRecords.forEach(item => {
        if (wallet.showCurrencys.indexOf(item.currencyName) >= 0) {
            const balance = fetchBalanceOfCurrency(item.currencyName);
            totalAssets += fetchBalanceValueOfCoin(item.currencyName, balance);
        }

    });

    return totalAssets;
};
/**
 * 获取云端总资产
 */
export const fetchCloudTotalAssets = () => {
    const cloudBalances = getCloudBalances();
    let totalAssets = 0;
    for (const [k, v] of cloudBalances) {
        totalAssets += fetchBalanceValueOfCoin(CloudCurrencyType[k], v);
    }

    return totalAssets;
};

/**
 * 获取某个币种对应的货币价值
 */
export const fetchBalanceValueOfCoin = (currencyName: string | CloudCurrencyType, balance: number) => {
    let balanceValue = 0;
    const USD2CNYRate = getStore('third/rate', 0);
    const currency2USDTMap = getStore('third/currency2USDTMap');
    const currency2USDT = currency2USDTMap.get(currencyName) || { open: 0, close: 0 };
    const currencyUnit = getStore('setting/currencyUnit', 'CNY');

    if (currencyUnit === 'CNY') {
        balanceValue = balance * currency2USDT.close * USD2CNYRate;
    } else if (currencyUnit === 'USD') {
        balanceValue = balance * currency2USDT.close;
    }

    return balanceValue;
};

/**
 * 获取本地钱包资产列表
 */
export const fetchWalletAssetList = () => {
    const wallet = getStore('wallet');
    const showCurrencys = (wallet && wallet.showCurrencys) || defalutShowCurrencys;
    const assetList = [];
    for (const k in MainChainCoin) {
        const item: any = {};
        if (MainChainCoin.hasOwnProperty(k) && showCurrencys.indexOf(k) >= 0) {
            item.currencyName = k;
            item.description = MainChainCoin[k].description;
            const balance = fetchBalanceOfCurrency(k);
            item.balance = formatBalance(balance);
            item.balanceValue = formatBalanceValue(fetchBalanceValueOfCoin(k, balance));
            item.gain = fetchCoinGain(k);
            item.rate = formatBalanceValue(fetchBalanceValueOfCoin(k,1));
            assetList.push(item);
        }

    }

    for (const k in ERC20Tokens) {
        const item: any = {};
        if (ERC20Tokens.hasOwnProperty(k) && showCurrencys.indexOf(k) >= 0) {
            item.currencyName = k;
            item.description = ERC20Tokens[k].description;
            const balance = fetchBalanceOfCurrency(k);
            item.balance = formatBalance(balance);
            item.balanceValue = formatBalanceValue(fetchBalanceValueOfCoin(k, balance));
            item.rate = formatBalanceValue(fetchBalanceValueOfCoin(k,1));
            item.gain = fetchCoinGain(k);
            assetList.push(item);
        }
    }

    return assetList;
};

/**
 * 获取云端钱包资产列表
 */
export const fetchCloudWalletAssetList = () => {
    const assetList = [];
    const cloudBalances = getCloudBalances();
    // const ktBalance = cloudBalances.get(CloudCurrencyType.KT) || 0;
    // const ktItem = {
    //     currencyName: 'KT',
    //     description: 'KuPlay Token',
    //     balance: formatBalance(ktBalance),
    //     balanceValue: formatBalanceValue(fetchBalanceValueOfCoin('KT', ktBalance)),
    //     gain: formatBalanceValue(0)
    // };
    // assetList.push(ktItem);
    // const cnytItem = {
    //     currencyName: 'CNYT',
    //     description: 'CNYT',
    //     balance: 0,
    //     balanceValue: '0.00',
    //     gain: formatBalanceValue(0)
    // };
    // assetList.push(cnytItem);
    for (const k in CloudCurrencyType) {
        const item: any = {};
        if (MainChainCoin.hasOwnProperty(k)) {
            item.currencyName = k;
            item.description = MainChainCoin[k].description;
            const balance = cloudBalances.get(CloudCurrencyType[k]) || 0;
            item.balance = formatBalance(balance);
            item.balanceValue = formatBalanceValue(fetchBalanceValueOfCoin(k, balance));
            item.gain = fetchCoinGain(k);
            item.rate = formatBalanceValue(fetchBalanceValueOfCoin(k,1));
            assetList.push(item);
        }
    }

    return assetList;
};

/**
 * 没有创建钱包时
 */
export const hasWallet = () => {
    const wallet = getStore('wallet');
    if (!wallet) {
        popNew('app-components1-modalBox-modalBox', {
            title: { zh_Hans:'提示',zh_Hant:'提示',en:'' },
            content: { zh_Hans:'你还没有登录，去登录使用更多功能吧',zh_Hant:'你還沒有登錄，去登錄使用更多功能吧',en:'' },
            sureText: { zh_Hans:'去登录',zh_Hant:'去登錄',en:'' },
            cancelText: { zh_Hans:'暂时不',zh_Hant:'暫時不',en:'' }
        }, () => {
            popNew('app-view-wallet-create-home');
            // popNew('app-view-base-localImg');
        });

        return false;
    }

    return true;
};

// 解析交易状态
export const parseStatusShow = (tx: TxHistory) => {
    if (!tx) {
        return {
            text: Config[getLang()].transfer.packing,// 打包
            icon: 'pending.png'
        };
    }
    const status = tx.status;
    if (status === TxStatus.Pending) {
        return {
            text: Config[getLang()].transfer.packing,// 打包
            icon: 'pending.png'
        };
    } else if (status === TxStatus.Confirmed) {
        return {
            text: `${Config[getLang()].transfer.confirmed} ${tx.confirmedBlockNumber}/${tx.needConfirmedBlockNumber}`,// 已确认
            icon: 'pending.png'
        };
    } else if (status === TxStatus.Failed) {
        return {
            text: Config[getLang()].transfer.transferFailed,// 交易失败
            icon: 'fail.png'
        };
    } else {
        return {
            text: Config[getLang()].transfer.completed,// 已完成
            icon: 'icon_right2.png'
        };
    }
};

// 解析转账类型
export const parseTxTypeShow = (txType: TxType) => {
    if (txType === TxType.Receipt) {
        return Config[getLang()].transfer.receipt;// 收款
    }

    return Config[getLang()].transfer.transfer;// 转账
};

// 解析是否可以重发
export const canResend = (tx) => {
    if (tx.status !== TxStatus.Pending) return false;
    if (tx.minerFeeLevel === MinerFeeLevel.Fastest) return false;
    const startTime = tx.time;
    const now = new Date().getTime();
    if (now - startTime < resendInterval) return false;

    return true;
};

/**
 * 获取钱包资产列表是否添加
 */
export const fetchWalletAssetListAdded = () => {
    const wallet = getStore('wallet');
    const showCurrencys = wallet.showCurrencys || defalutShowCurrencys;
    const assetList = [];
    for (const k in MainChainCoin) {
        const item: any = {};
        if (MainChainCoin.hasOwnProperty(k) && k !== 'KT') {
            item.currencyName = k;
            item.description = MainChainCoin[k].description;
            if (showCurrencys.indexOf(k) >= 0) {
                item.added = true;
            } else {
                item.added = false;
            }
            if (notSwtichShowCurrencys.indexOf(k) >= 0) {
                item.canSwtiched = false;
            } else {
                item.canSwtiched = true;
            }
            assetList.push(item);
        }

    }

    for (const k in ERC20Tokens) {
        const item: any = {};
        if (ERC20Tokens.hasOwnProperty(k)) {
            item.currencyName = k;
            item.description = ERC20Tokens[k].description;
            if (showCurrencys.indexOf(k) >= 0) {
                item.added = true;
            } else {
                item.added = false;
            }
            if (notSwtichShowCurrencys.indexOf(k) >= 0) {
                item.canSwtiched = false;
            } else {
                item.canSwtiched = true;
            }
            assetList.push(item);
        }
    }

    return assetList;
};

// 获取货币的涨跌情况
export const fetchCoinGain = (currencyName: string) => {
    const currency2USDT: Currency2USDT = getStore('third/currency2USDTMap').get(currencyName);
    if (!currency2USDT) return formatBalanceValue(0);

    return formatBalanceValue(((currency2USDT.close - currency2USDT.open) / currency2USDT.open) * 100);
};
/**
 * 转化rtype
 */
export const parseRtype = (rType) => {
    if (rType === 0) return Config[getLang()].luckeyMoney.ordinary; // 普通
    if (rType === 1) return Config[getLang()].luckeyMoney.random; // 随机
    if (rType === 99) return Config[getLang()].luckeyMoney.invite; // 邀请

    return '';
};
/**
 * 获取某id理财产品持有量，不算已经赎回的
 */
export const fetchHoldedProductAmount = (id: string) => {
    const purchaseRecord = getStore('activity/financialManagement/purchaseHistories');
    let holdAmout = 0;
    for (let i = 0; i < purchaseRecord.length; i++) {
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
export const calPercent = (surplus: number, total: number) => {
    if (surplus === 0) {
        return {
            left: 0,
            use: 100
        };
    }
    if (surplus === total) {
        return {
            left: 100,
            use: 0
        };
    }
    if (surplus <= total / 100) {
        return {
            left: 1,
            use: 99
        };
    }
    const r = Number((surplus / total).toString().slice(0, 4));

    return {
        left: r * 100,
        use: 100 - r * 100
    };
};

/**
 * base64 to blob
 */
export const base64ToBlob = (base64: string) => {
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
export const base64ToFile = (base64: string) => {
    const blob = base64ToBlob(base64);
    const newFile = new File([blob], 'avatar.jpeg', { type: blob.type });
    console.log(newFile);

    return newFile;
};

/**
 * 获取用户基本信息
 */
export const getUserInfo = () => {
    const userInfo = getStore('user/info');
    const nickName = userInfo.nickName;
    const phoneNumber = userInfo.phoneNumber;
    const isRealUser = userInfo.isRealUser;
    let avatar = userInfo.avatar;
    if (avatar && avatar.indexOf('data:image') < 0) {
        avatar = `${uploadFileUrlPrefix}${avatar}`;
    }

    return {
        nickName,
        avatar,
        phoneNumber,
        isRealUser
    };
};

/**
 * 获取区块确认数
 */
export const getConfirmBlockNumber = (currencyName: string, amount: number) => {
    if (ERC20Tokens[currencyName]) {
        return currencyConfirmBlockNumber.ERC20;
    }
    const confirmBlockNumbers = currencyConfirmBlockNumber[currencyName];
    for (let i = 0; i < confirmBlockNumbers.length; i++) {
        if (amount < confirmBlockNumbers[i].value) {
            return confirmBlockNumbers[i].number;
        }
    }
};

/**
 * 获取设备唯一id
 */
export const fetchDeviceId = async () => {
    if (navigator.userAgent.indexOf('YINENG') < 0) { // ===================pc====================
        return new Promise((resolve,reject) => {
            const hash256 = sha256(getStore('user/id'));
            resolve(hash256);
        });
    } else {// ============================mobile
        return new Promise((resolve,reject) => {
            getDeviceId((deviceId:string) => {
                const hash256 = sha256(deviceId + getStore('user/id'));
                resolve(hash256);
            },(err) => {
                reject(err);
            });
        });
    }
   
};

/**
 * 根据当前语言设置获取静态文字，对于组件模块
 */
export const getLanguage = (w) => {
    const lan = getStore('setting/language', 'zh_Hans');
    // if (lan) {
    //     return w.config.value[lan.languageList[lan.selected]];
    // }

    return w.config.value[lan];
};

/**
 * 根据当前语言设置获取静态文字，对于单独的ts文件
 */
export const getStaticLanguage = () => {
    const lan = getStore('setting/language', 'zh_Hans');
    // if (lan) {
    //     return Config[lan.languageList[lan.selected]];
    // }

    return Config[lan];
};

/**
 * 助记词片段分享加密
 * 为了便于识别用户使用的是同一组密钥，会在分享出去的密钥的第2/4/6/8/10/12加上一个相同的随机数
 */
export const mnemonicFragmentEncrypt = (fragments: string[]) => {
    const len = 6;
    const randomArr = [];
    for (let i = 0; i < len; i++) {
        const random = Math.floor(Math.random() * 10);
        randomArr.push(random);
    }
    const retFragments = [];
    for (let i = 0; i < fragments.length; i++) {
        const fragmentArr = fragments[i].split('');
        let j = 1;
        // tslint:disable-next-line:binary-expression-operand-order
        while (2 * j <= 12) {
            // tslint:disable-next-line:binary-expression-operand-order
            fragmentArr.splice(2 * j - 1, 0, randomArr[j - 1]);
            j++;
        }
        retFragments.push(fragmentArr.join(''));
    }

    return retFragments;
};

/**
 * 助记词片段分享解密
 * 为了便于识别用户使用的是同一组密钥，会在分享出去的密钥的第2/4/6/8/10/12加上一个相同的随机数
 */
export const mnemonicFragmentDecrypt = (fragment: string) => {
    const fragmentArr = fragment.split('');
    const randomArr = [];
    let j = 6;
    while (j > 0) {
        // tslint:disable-next-line:binary-expression-operand-order
        const delRandom = fragmentArr.splice(2 * j - 1, 1);
        j--;
        randomArr.push(delRandom);
    }

    return {
        fragment: fragmentArr.join(''),
        randomStr: randomArr.reverse().join('')
    };
};

/**
 * 注销账户并删除数据
 */
export const logoutAccountDel = () => {
    const user = {
        id: '',                      // 该账号的id
        isLogin: false,              // 登录状态
        offline:true,                // 在线状态
        token: '',                   // 自动登录token
        conRandom: '',               // 连接随机数
        conUid: '',                   // 服务器连接uid
        publicKey: '',               // 用户公钥, 第一个以太坊地址的公钥
        salt: cryptoRandomInt().toString(),                    // 加密 盐值
        secretHash: '',             // 密码hash缓存   
        info: {                      // 用户基本信息
            nickName: '',           // 昵称
            avatar: '',            // 头像
            phoneNumber: '',       // 手机号
            isRealUser: false    // 是否是真实用户
        }
    };
    const cloud = {
        cloudWallets: initCloudWallets()     // 云端钱包相关数据, 余额  充值提现记录...
    };
    
    const activity = {
        luckyMoney: {
            sends: null,          // 发送红包记录
            exchange: null,       // 兑换红包记录
            invite: null          // 邀请红包记录
        },
        mining: {
            total: null,      // 挖矿汇总信息
            history: null, // 挖矿历史记录
            addMine: [],  // 矿山增加项目
            mineRank: null,    // 矿山排名
            miningRank: null,  // 挖矿排名
            itemJump: null
        },                       // 挖矿
        dividend: {
            total: null,         // 分红汇总信息
            history: null       // 分红历史记录
        },
        financialManagement: {          // 理财
            products: null,
            purchaseHistories: null
        }
    };

    let lockScreen = getStore('setting/lockScreen');
    lockScreen = {
        psw:'',
        open:false
    };
    setStore('wallet',null,false);
    setStore('cloud',cloud,false);
    setStore('user',user);
    setStore('activity',activity);
    setStore('setting/lockScreen',lockScreen);
    setBottomLayerReloginMsg('','','');
    closeCon();
    setTimeout(() => {
        openConnect();
    },100);
    
};

/**
 * 注销账户保留数据
 */
export const logoutAccount = () => {
    setStore('flags', { saveAccount:true });
    logoutAccountDel();
};

/**
 * 登录成功
 */
export const loginSuccess = (account:Account) => {    
    // const secretHash = getStore('user/secretHash');
    const fileUser = account.user;
    const user:User = {
        isLogin: false,
        offline:true,
        conRandom:'',
        conUid:'',
        secretHash:'',
        id : fileUser.id,
        token : fileUser.token,
        publicKey : fileUser.publicKey,
        salt : fileUser.salt,
        info : { ...fileUser.info }
    };
   
    const localWallet = account.wallet;
    const currencyRecords = [];
    for (const localRecord of localWallet.currencyRecords) {
        const addrs = [];
        for (const info of localRecord.addrs) {
            const addrInfo:AddrInfo = {
                addr:info.addr,
                balance:info.balance,
                txHistory:[]
            };
            addrs.push(addrInfo);
        }
        const record:CurrencyRecord = {
            currencyName: localRecord.currencyName,           
            currentAddr: localRecord.currentAddr ,           
            addrs,             
            updateAddr: localRecord.updateAddr         
        };
        currencyRecords.push(record);
    }
    const wallet:Wallet = {
        vault:localWallet.vault,                 
        isBackup: localWallet.isBackup,                 
        showCurrencys: localWallet.showCurrencys,           
        currencyRecords
    };
  
    const cloud = getStore('cloud');
    const localCloudWallets = new Map<CloudCurrencyType, LocalCloudWallet>(account.cloud.cloudWallets);
    for (const [key,value] of localCloudWallets) {
        const cloudWallet = cloud.cloudWallets.get(key);
        cloudWallet.balance = localCloudWallets.get(key).balance;
    }

    setStore('wallet',wallet,false);
    setStore('cloud',cloud,false);
    setStore('user',user);
    setStore('flags',{});
    openConnect();
};

/**
 * 判断是否是有效的货币地址
 */
export const isValidAddress = (addr: string, currencyName: string) => {
    if (currencyName === 'BTC') {
        // todo
    } else {
        return isETHValidAddress(addr);
    }
};

/**
 * 判断是否是有效的ETH地址
 */
const isETHValidAddress = (addr: string) => {
    if (!addr || !addr.startsWith('0x') || addr.length !== 42) return false;
    if (isNaN(Number(addr))) return false;

    return true;
};

declare var pi_modules;

// 获取本地版本号
export const getLocalVersion = () => {
    const updateMod = pi_modules.update.exports;
    const versionArr = updateMod.getLocalVersion();
    const versionStr = versionArr.join('.');

    return versionStr.slice(0, versionStr.length - 7);
};

// 获取远端版本号
export const getRemoteVersion = () => {
    const updateMod = pi_modules.update.exports;
    const versionArr = updateMod.getRemoteVersion();
    const versionStr = versionArr.join('.');

    return versionStr.slice(0, versionStr.length - 7);
};

// 更新矿工费
export const fetchMinerFeeList = (currencyName) => {
    const cn = (currencyName === 'ETH' || ERC20Tokens[currencyName]) ? 'ETH' : 'BTC';
    const toa = timeOfArrival[cn];
    const minerFeeList = [];
    for (let i = 0; i < toa.length; i++) {
        let minerFee = 0;
        if (cn === 'ETH') {
            const gasLimit = getStore('third/gasLimitMap').get(currencyName) || defaultGasLimit;
            minerFee = wei2Eth(gasLimit * fetchGasPrice(toa[i].level));
        } else {
            minerFee = sat2Btc(fetchBtcMinerFee(toa[i].level));
        }
        const obj = {
            ...toa[i],
            minerFee
        };
        minerFeeList.push(obj);
    }

    return minerFeeList;
};

/**
 * 获取货币单位符号 $ ￥
 */
export const getCurrencyUnitSymbol = () => {
    const currencyUnit = getStore('setting/currencyUnit', 'CNY');
    if (currencyUnit === 'CNY') {
        return '￥';
    } else if (currencyUnit === 'USD') {
        return '$';
    }
};

/**
 * 检查是否是创建账户,通知弹窗备份
 */
export const checkCreateAccount = () => {
    const flags = getStore('flags');
    // 第一次创建检查是否有登录后弹框提示备份
    if (flags.created) {
        flags.promptBackup = true;
        flags.created = false;
        setStore('flags', flags);
    }
};

/**
 * 判断地址是否合法
 * @param ctype 货币名称
 * @param str 地址
 */
export const judgeAddressAvailable = (ctype: string, addr: string) => {
    if (ctype === 'BTC') {
        return /^[0-9a-zA-Z]{26,34}$/.test(addr);
    } else {
        return /(^0x)[0-9a-fA-f]{40}$/.test(addr);
    }
};

/**
 * 解析交易的额外信息
 */
export const parseTransferExtraInfo = (input: string) => {
    return input === '0x' ? '无' : input;
};

/**
 * 更新本地交易记录
 */
export const updateLocalTx = (tx: TxHistory) => {
    const wallet = getStore('wallet');
    if (!wallet) return;
    const currencyName = tx.currencyName;
    const addr = tx.addr;
    wallet.currencyRecords.forEach(record => {
        if (record.currencyName === currencyName) {
            record.addrs.forEach(addrInfo => {
                if (addrInfo.addr.toLowerCase() === addr.toLowerCase()) {
                    let index = -1;
                    const txHistory = addrInfo.txHistory;
                    for (let i = 0; i < txHistory.length; i++) {
                        if (txHistory[i].hash === tx.hash) {
                            index = i;
                            break;
                        }
                    }
                    if (index >= 0) {
                        txHistory.splice(index, 1, tx);
                    } else {
                        txHistory.push(tx);
                    }
                }
            });
        }
    });

    setStore('wallet/currencyRecords', wallet.currencyRecords);
};

/**
 * 删除本地交易记录
 */
export const deletLocalTx = (tx: TxHistory) => {
    const wallet = getStore('wallet');
    const currencyName = tx.currencyName;
    const addr = tx.addr;
    wallet.currencyRecords.forEach(record => {
        if (record.currencyName === currencyName) {
            record.addrs.forEach(addrInfo => {
                if (addrInfo.addr === addr) {
                    let index = -1;
                    const txHistory = addrInfo.txHistory;
                    for (let i = 0; i < txHistory.length; i++) {
                        if (txHistory[i].hash === tx.hash) {
                            index = i;
                            break;
                        }
                    }
                    if (index >= 0) {
                        txHistory.splice(index, 1);
                    }
                }
            });
        }
    });

    setStore('wallet/currencyRecords', wallet.currencyRecords);
};

/**
 * 获取某个地址的nonce
 * 只取ETH地址下的nonce
 */
export const getEthNonce = (addr: string) => {
    const wallet = getStore('wallet');
    for (const record of wallet.currencyRecords) {
        if (record.currencyName === 'ETH') {
            for (const addrInfo of record.addrs) {
                if (addrInfo.addr === addr) {
                    return addrInfo.nonce;
                }
            }
        }

    }
};

/**
 * 设置某个地址的nonce
 * 只设置ETH地址下的nonce
 */
export const setEthNonce = (newNonce: number, addr: string) => {
    const wallet = getStore('wallet');
    for (const record of wallet.currencyRecords) {
        if (record.currencyName === 'ETH') {
            for (const addrInfo of record.addrs) {
                if (addrInfo.addr === addr) {
                    addrInfo.nonce = newNonce;
                    setStore('wallet', wallet);

                    return;
                }
            }
        }

    }
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

/**
 * 异或解码 直接解析字符串
 */
export const xorDecode = (str:string, key:string) => {
    const ord = []; 
    let res = '';

    for (let i = 1; i <= 255; i++) {ord[String.fromCharCode(i)] = i;}

    for (let i = 0; i < str.length; i++) {
        res += String.fromCharCode(ord[str.substr(i, 1)] ^ ord[key.substr(i %    key.length, 1)]);
    }

    return res;
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