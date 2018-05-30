import { register, updateStore, find } from '../store/store'
import { Cipher } from '../core/crypto/cipher'
import { Api } from '../core/eth/api';
import { isNumber } from '../../pi/util/util';
import { Addr } from '../view/interface';

export function setLocalStorage(key: string, data: any, notified?: boolean) {
    updateStore(key, data, notified);
}

export function getLocalStorage(key: string) {
    return find(key);
}

export function getCurrentWallet(wallets) {
    if (!(wallets && wallets.curWalletId && wallets.curWalletId.length > 0)) {
        return null;
    }
    for (let i = 0; i < wallets.walletList.length; i++) {
        if (wallets.walletList[i].walletId === wallets.curWalletId) {
            return wallets.walletList[i];
        }
    }
    return null;
}

/**
 * 获取当前钱包index
 * @param wallets 
 */
export function getCurrentWalletIndex(wallets) {
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
}


/**
 * 通过地址id获取地址信息
 * @param addrId 
 */
export const getAddrById = (addrId): Addr => {
    let list: Addr[] = getLocalStorage("addrs") || [];
    return list.filter(v => v.addr === addrId)[0];
}

/**
 * 通过地址id重置地址
 * @param addrId 
 * @param data 
 * @param notified 
 */
export const resetAddrById = (addrId, data: Addr, notified?: boolean) => {
    let list: Addr[] = getLocalStorage("addrs") || [];
    list = list.map(v => {
        if (v.addr !== addrId) return v;

        return data;
    })
    setLocalStorage("addrs", list, notified);
}

  /**
 * 获取钱包下的所有地址
 * @param wallet 
 */
 export  function getAddrsAll(wallet){
    let currencyRecords = wallet.currencyRecords;
    let retAddrs = [];
    currencyRecords.forEach((item)=>{
        item.addrs.forEach((addr)=>{
            retAddrs.push(addr);
        });
    });
    return retAddrs;
}

//Password used to encrypt the plainText
const passwd = "gaia";
/**
 * 密码加密
 * @param plainText 
 */
export function encrypt(plainText: string) {
    const cipher = new Cipher();
    return cipher.encrypt(passwd, plainText);
}

/**
 * 密码解密
 * @param cipherText 
 */
export function decrypt(cipherText: string) {
    const cipher = new Cipher();
    return cipher.decrypt(passwd, cipherText);
}

export function randomRgbColor() { //随机生成RGB颜色
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`; //返回rgb(r,g,b)格式颜色
}


/**
 * 解析显示的账号信息
 * @param str 
 */
export const parseAccount = (str: string) => {
    if (str.length <= 29) return str;
    return `${str.slice(0, 13)}...${str.slice(str.length - 13, str.length)}`;
}

export const getDefaultAddr = (addr: number | string) => {
    let addrStr = addr.toString();
    return `${addrStr.slice(0, 3)}...${addrStr.slice(-3)}`;
}

/**
 * wei转Eth
 */
export const wei2Eth = (num: number) => {
    return num / Math.pow(10, 18)
}

/**
 * wei转Eth
 */
export const eth2Wei = (num: number) => {
    return num * Math.pow(10, 18)
}

/**
 * 获取有效的货币
 * 
 * @param perNum 转化前数据
 * @param currencyName  当前货币类型
 * @param conversionType 转化类型
 * @param isWei 是否wei转化
 */
export async function effectiveCurrency(perNum: any, currencyName: string, conversionType: string, isWei: boolean) {
    let api = new Api();
    let r: any = { num: 0, show: "", conversionShow: "" };
    if (currencyName === "ETH") {
        let rate: any = await api.getExchangeRate();
        let num = isWei ? wei2Eth(!isNumber(perNum) ? perNum.toNumber() : perNum) : perNum;

        r.num = num;
        r.show = `${num} ETH`;
        r.conversionShow = `≈${conversionType === "CNY" ? "￥" : "$"}${(num * rate[conversionType]).toFixed(2)}`;
    }
    return r

}
/**
 * 获取有效的货币不需要转化
 * 
 * @param perNum 转化前数据
 * @param currencyName  当前货币类型
 * @param isWei 是否wei转化
 */
export const effectiveCurrencyNoConversion = (perNum: any, currencyName: string, isWei: boolean) => {
    let api = new Api();
    let r: any = { num: 0, show: "", conversionShow: "" };
    if (currencyName === "ETH") {
        let num = isWei ? wei2Eth(!isNumber(perNum) ? perNum.toNumber() : perNum) : perNum;

        r.num = num;
        r.show = `${num} ETH`;
    }
    return r

}

/**
 * 获取有效的货币不需要转化
 * 
 * @param perNum 转化前数据
 * @param currencyName  当前货币类型
 * @param isWei 是否wei转化
 */
export const effectiveCurrencyStableConversion = (perNum: any, currencyName: string, conversionType: string, isWei: boolean, rate: any) => {
    let api = new Api();
    let r: any = { num: 0, show: "", conversionShow: "" };
    if (currencyName === "ETH") {
        let num = isWei ? wei2Eth(!isNumber(perNum) ? perNum.toNumber() : perNum) : perNum;

        r.num = num;
        r.show = `${num} ETH`;
        r.conversionShow = `≈${conversionType === "CNY" ? "￥" : "$"}${(num * rate[conversionType]).toFixed(2)}`;
    }
    return r

}

/**
 * 转化显示时间
 * @param t 
 */
export const parseDate = (t: Date) => {
    return `${t.getUTCFullYear()}-${addPerZero(t.getUTCMonth() + 1, 2)}-${addPerZero(t.getUTCDate(), 2)} ${addPerZero(t.getHours(), 2)}:${addPerZero(t.getMinutes(), 2)}`;
}




/**
 * 数字前边加0
 */
const addPerZero = (num: number, len: number) => {
    let numStr = num.toString();
    let perLen = len - numStr.length;
    if (perLen <= 0) return numStr
    let list = [];
    list.length = perLen;
    return list.fill("0").join("") + numStr;
}


//数组乱序
export function shuffle(arr: Array<any>): Array<any> {
    var length = arr.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
        rand = ~~(Math.random() * (index + 1));
        if (rand !== index) {
            shuffled[index] = shuffled[rand];
        }
        shuffled[rand] = arr[index];
    }
    return shuffled;
};
