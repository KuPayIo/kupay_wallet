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
import { Addr } from '../store/interface';
import { find, updateStore } from '../store/store';
import { lang, MAX_SHARE_LEN, MIN_SHARE_LEN } from './constants';
import { calcHashValuePromise, hexstrToU8Array, initAddr, popNewMessage, popNewLoading, unicodeArray2Str } from './tools';
import { buyProduct, getCloudBalance, getPurchaseRecord } from '../net/pull';
import { shareSecret } from './secretsBase';
import { arrayBufferToBase64 } from '../../pi/util/base64';
import { nameWare } from './nameWareHouse';

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
    const newAddrInfo: Addr = initAddr(address, currencyName, addrName);
    addrs.push(newAddrInfo);
    dataCenter.updateAddrInfo(address, addrName);
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
    const hash = await calcHashValuePromise(passwd, find('salt'));
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
    const hash = await calcHashValuePromise(passwd, find('salt'));
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
export const getMnemonicHexstr = (wallet, hash) => {
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
    txList = transactions.filter(v => v.addr === addr && v.currencyName === currencyName);
    return txList.sort((a, b) => b.time - a.time);
};

/**
 * 根据交易hash获取指定地址上本地交易详情
 */
export const fetchLocalTxByHash = (addr:string,currencyName:string,hash:string)=>{
    const txList = fetchTransactionList(addr,currencyName);
    for(let i = 0; i < txList.length;i++){
        if(txList[i].hash === hash){
            return txList[i];
        }
    }
}

/**
 * 根据交易hash获取所有地址上本地交易详情
 */
export const fetchLocalTxByHash1 = (hash:string)=>{
    const txList = find('transactions') || [];
    for(let i = 0; i < txList.length;i++){
        if(txList[i].hash === hash){
            return txList[i];
        }
    }
}

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
    if(data){
        popNewMessage('购买成功');
        getCloudBalance();
        console.log('data',data);
        getPurchaseRecord();// 购买之后获取购买记录
    }
    return data;
}

//获取助记词片段
export const fetchMnemonicFragment =  (hash) =>{
    const mnemonicHexstr =  getMnemonicHexstr(find('curWallet'),hash);
    if(!mnemonicHexstr) return;
    const shares = shareSecret(mnemonicHexstr, MAX_SHARE_LEN, MIN_SHARE_LEN)
            .map(v => arrayBufferToBase64(hexstrToU8Array(v).buffer));
    console.log('fetchMnemonicFragment-----------',shares);
    return shares;
}

// 备份助记词
export const backupMnemonic = async (passwd:string) =>{
    const close = popNewLoading('导出中...');
    const hash = await calcHashValuePromise(passwd, find('salt'));
    console.log('hash!!!!!!!!!!!!',hash);
    close.callback(close.widget);
    const mnemonic = getMnemonicByHash(hash);
    const fragments = fetchMnemonicFragment(hash);
    if(!mnemonic){
        popNewMessage('密码错误');
        return;
    }
    return {
        mnemonic,
        fragments
    }
}

//根据hash获取助记词
export const getMnemonicByHash = (hash:string)=>{
    const gwlt = GlobalWallet.fromJSON(find('curWallet').gwlt);
    try {
        const cipher = new Cipher();
        const r = cipher.decrypt(hash, gwlt.vault);

        return toMnemonic(lang, hexstrToU8Array(r));
    } catch (error) {
        console.log(error);

        return '';
    }
}


/**
 * 获取随机名字
 */
export const playerName = function () {
	var num1 = nameWare[0].length;
	var num2 = nameWare[1].length;
	var name="";
	name= unicodeArray2Str(nameWare[0][Math.floor(Math.random()*num1)])+ unicodeArray2Str(nameWare[1][Math.floor(Math.random()*num2)]);
	return name;
};