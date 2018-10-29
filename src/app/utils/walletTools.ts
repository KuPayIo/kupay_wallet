/**
 * 和第3方库相关的一些工具函数
 */
import { arrayBufferToBase64 } from '../../pi/util/base64';
import { ERC20Tokens } from '../config';
import { BTCWallet } from '../core/btc/wallet';
import { Cipher } from '../core/crypto/cipher';
import { ibanToAddress, isValidIban } from '../core/eth/helper';
import { EthWallet } from '../core/eth/wallet';
import { toMnemonic } from '../core/genmnemonic';
import { GlobalWallet } from '../core/globalWallet';
import { dataCenter } from '../logic/dataCenter';
import { buyProduct, getCloudBalance, getPurchaseRecord } from '../net/pull';
import { Addr } from '../store/interface';
import { find, getStore, updateStore } from '../store/memstore';
import { lang, MAX_SHARE_LEN, MIN_SHARE_LEN } from './constants';
import { nameWare } from './nameWareHouse';
import { shareSecret } from './secretsBase';
import { calcHashValuePromise, hexstrToU8Array, initAddr, popNewLoading, popNewMessage, unicodeArray2Str } from './tools';

/**
 * 获取新的地址信息
 * @param currencyName 货币类型
 */
export const getNewAddrInfo = (currencyName, wallet) => {
    const currencyRecord = wallet.currencyRecords.filter(v => v.currencyName === currencyName)[0];
    if (!currencyRecord) return;
    const addrs = find('addrs') || [];
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
export const VerifyIdentidy = async (passwd:string) => {
    const wallet = getStore('wallet');
    const hash = await calcHashValuePromise(passwd, getStore('user/salt'));

    try {
        const cipher = new Cipher();
        const r = cipher.decrypt(hash, wallet.vault);

        return true;
    } catch (error) {
        console.log(error);

        return false;
    }
};

/**
 * 获取助记词
 */
export const getMnemonic = async (passwd) => {
    const wallet = getStore('wallet');
    const hash = await calcHashValuePromise(passwd, getStore('user/salt'));
    try {
        const cipher = new Cipher();
        const r = cipher.decrypt(hash, wallet.vault);

        return toMnemonic(lang, hexstrToU8Array(r));
    } catch (error) {
        console.log(error);

        return '';
    }
};
/**
 * 获取助记词16进制字符串
 */
export const getMnemonicHexstr = (hash) => {
    const wallet = getStore('wallet');
    try {
        const cipher = new Cipher();

        return cipher.decrypt(hash, wallet.vault);
    } catch (error) {
        console.log(error);

        return '';
    }
};

/**
 * 获取某个地址的交易记录
 */
export const fetchTransactionList = (addr:string,currencyName:string) => {
    const wallet = getStore('wallet');
    if (!wallet) return [];
    const txList = [];
    wallet.currencyRecords.forEach(record => {
        if (record.currencyName === currencyName && record.currentAddr === addr) {
            record.addrs.forEach(addrInfo => {
                if (addrInfo.addr === addr) {
                    txList.push(...addrInfo.txHistory);
                }
            });
        }
    });
    
    return txList.sort((a, b) => b.time - a.time);
};

/**
 * 根据交易hash获取指定地址上本地交易详情
 */
export const fetchLocalTxByHash = (addr:string,currencyName:string,hash:string) => {
    const txList = fetchTransactionList(addr,currencyName);
    for (const tx of txList) {
        // tslint:disable-next-line:possible-timing-attack
        if (tx.hash === hash) {
            return tx;
        }
    }
};

/**
 * 根据交易hash获取所有地址上本地交易详情
 */
export const fetchLocalTxByHash1 = (hash:string) => {
    const wallet = getStore('wallet');
    let txHistory = [];
    for (const record of wallet.currencyRecords) {
        for (const addrInfo of record.addrs) {
            txHistory = txHistory.concat(addrInfo.txHistory);
        }
    }
    for (const tx of txHistory) {
        // tslint:disable-next-line:possible-timing-attack
        if (tx.hash === hash) {
            return tx;
        }
    }
};

// 购买理财
export const purchaseProduct = async (psw:string,productId:string,amount:number) => {
    const close = popNewLoading('正在购买...');    
    const pswCorrect = await VerifyIdentidy(find('curWallet'),psw,false);
    if (!pswCorrect) {
        close.callback(close.widget);
        popNewMessage('密码不正确');    
        
        return;
    }
    const data = await buyProduct(productId,amount);
    close.callback(close.widget);
    if (data) {
        popNewMessage('购买成功');
        getCloudBalance();
        console.log('data',data);
        getPurchaseRecord();// 购买之后获取购买记录
    }
    
    return data;
};

// 获取助记词片段
export const fetchMnemonicFragment =  (hash) => {
    const mnemonicHexstr =  getMnemonicHexstr(hash);
    if (!mnemonicHexstr) return;
    const shares = shareSecret(mnemonicHexstr, MAX_SHARE_LEN, MIN_SHARE_LEN)
            .map(v => arrayBufferToBase64(hexstrToU8Array(v).buffer));
    console.log('fetchMnemonicFragment-----------',shares);
    
    return shares;
};

// 备份助记词
export const backupMnemonic = async (passwd:string) => {
    const close = popNewLoading('导出中...');
    const hash = await calcHashValuePromise(passwd, find('salt'));
    console.log('hash!!!!!!!!!!!!',hash);
    close.callback(close.widget);
    const mnemonic = getMnemonicByHash(hash);
    const fragments = fetchMnemonicFragment(hash);
    if (!mnemonic) {
        popNewMessage('密码错误');
        
        return;
    }

    return {
        mnemonic,
        fragments
    };
};

// 根据hash获取助记词
export const getMnemonicByHash = (hash:string) => {
    const wallet = getStore('wallet');
    try {
        const cipher = new Cipher();
        const r = cipher.decrypt(hash, wallet.vault);

        return toMnemonic(lang, hexstrToU8Array(r));
    } catch (error) {
        console.log(error);

        return '';
    }
};

/**
 * 获取随机名字
 */
export const playerName =  () => {
    const num1 = nameWare[0].length;
    const num2 = nameWare[1].length;
    let name = '';
    // tslint:disable-next-line:max-line-length
    name = unicodeArray2Str(nameWare[0][Math.floor(Math.random() * num1)]) + unicodeArray2Str(nameWare[1][Math.floor(Math.random() * num2)]);
    
    return name;
};

/**
 * 获取钱包地址的位置
 */
export const getWltAddrIndex = (addr: string, currencyName: string) => {
    const wallet = getStore('wallet');
    const currencyRecord = wallet.currencyRecords.filter(v => v.currencyName === currencyName)[0];
    const addrs = currencyRecord.addrs;
    for (let i = 0;i < addrs.length;i++) {
        if (addrs[i].addr === addr) {
            return i;
        }
    }

    return -1;
};