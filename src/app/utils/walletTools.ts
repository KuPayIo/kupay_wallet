/**
 * 和第3方库相关的一些工具函数
 */
import { isNumber } from '../../pi/util/util';
import { BTCWallet } from '../core/btc/wallet';
import { Cipher } from '../core/crypto/cipher';
import { ibanToAddress, isValidIban } from '../core/eth/helper';
import { ERC20Tokens } from '../core/eth/tokens';
import { EthWallet } from '../core/eth/wallet';
import { toMnemonic } from '../core/genmnemonic';
import { GlobalWallet } from '../core/globalWallet';
import { dataCenter } from '../logic/dataCenter';
import { Addr } from '../store/interface';
import { find, updateStore } from '../store/store';
import { lang } from './constants';
import { calcHashValuePromise, fetchBalanceOfCurrency, formatBalance, hexstrToU8Array } from './tools';
import { ethTokenDivideDecimals, sat2Btc, wei2Eth } from './unitTools';

// 加密盐值
const salt = 'KuPay';
/**
 * 密码加密
 * @param plainText 需要加密的文本
 */
export const encrypt = (plainText: string) => {
    const cipher = new Cipher();

    return cipher.encrypt(salt, plainText);
};

/**
 * 密码解密
 * @param cipherText 需要解密的文本
 */
export const decrypt = (cipherText: string) => {
    const cipher = new Cipher();

    return cipher.decrypt(salt, cipherText);
};

// hash256;
export const sha256 = (data: string) => {
    const cipher = new Cipher();

    return cipher.sha256(data);
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
    num = formatBalance(num);
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
 * 获取新的地址信息
 * @param currencyName 货币类型
 */
export const getNewAddrInfo = (currencyName, wallet) => {
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
