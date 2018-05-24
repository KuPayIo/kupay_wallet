import { register, updateStore, find } from '../store/store'
import { Cipher } from '../core/crypto/cipher'
import { Api } from '../core/eth/api';
import { isNumber } from '../../pi/util/util';

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