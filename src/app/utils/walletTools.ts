/**
 * 和第3方库相关的一些工具函数
 */
import { ERC20Tokens } from '../config';
import { BTCWallet } from '../core/btc/wallet';
import { Cipher } from '../core/crypto/cipher';
import { ibanToAddress, isValidIban } from '../core/eth/helper';
import { EthWallet } from '../core/eth/wallet';
import { toMnemonic } from '../core/genmnemonic';
import { GlobalWallet } from '../core/globalWallet';
import { dataCenter } from '../logic/dataCenter';
import { Addr, TxStatus } from '../store/interface';
import { find, updateStore } from '../store/store';
import { lang } from './constants';
import { calcHashValuePromise, getAddrById, hexstrToU8Array, parseDate, timestampFormat } from './tools';
import { smallUnit2LargeUnit } from './unitTools';

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
    const addrs: Addr[] = find('addrs') || [];
    wallet.currencyRecords.forEach(currencyRecord => {
        if (currencyRecord.currencyName === currencyName) {
            currencyRecord.addrs.push(address);
            currencyRecord.currentAddr = address;
        }
    });
    const newAddrInfo: Addr = dataCenter.initAddr(address, currencyName, addrName);
    addrs.push(newAddrInfo);
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
 * 验证身份
 */
export const VerifyIdentidy = async (wallet, passwd, useCache: boolean = true) => {
    const hash = await calcHashValuePromise(passwd, find('salt'), wallet.walletId, useCache);
    const gwlt = GlobalWallet.fromJSON(wallet.gwlt);

    try {
        const cipher = new Cipher();
        const r = cipher.decrypt(hash, gwlt.vault);

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

        return cipher.decrypt(hash, gwlt.vault);
    } catch (error) {
        console.log(error);

        return '';
    }
};

/**
 * 获取某个地址的交易记录
 */
export const fetchTransactionList = (addr:string,currencyName:string) => {
    if (!addr) return [];
    // 从缓存中取出对应地址的交易记录
    const transactions = find('transactions') || [];
    let txList = [];
    if (currencyName === 'ETH' || ERC20Tokens[currencyName]) {
        txList = transactions.filter(v => v.addr === addr && v.currencyName === currencyName);
    } else if (currencyName === 'BTC') {
        txList = transactions.filter(v => v.addr === addr && v.currencyName === currencyName).map(v => {
            if (v.inputs.indexOf(addr) >= 0) {
                v.from = addr;
                v.to = v.outputs[0];
            } else {
                v.from = v.inputs[0];
                v.to = addr;
            }

            return v;
        });
    }

    txList = txList.map(v => {
        const pay = smallUnit2LargeUnit(currencyName,v.value);
        const fee = smallUnit2LargeUnit(ERC20Tokens[currencyName] ? 'ETH' : currencyName,v.fees);
        const isFromMe = v.from.toLowerCase() === addr.toLowerCase();

        return {
            hash: v.hash,
            txType: isFromMe ? 1 : 2,
            fromAddr: v.from,
            toAddr: v.to,
            pay,
            fee,
            time: v.time,
            status: TxStatus.SUCCESS,
            info: v.info,
            currencyName: currencyName
        };
    });

    const addrInfo = getAddrById(addr,currencyName);

    return txList.concat(addrInfo.record).sort((a, b) => b.time - a.time);
};
