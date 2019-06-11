/**
 * 和第3方库相关的一些工具函数
 */
import { arrayBufferToBase64 } from '../../pi/util/base64';
import { getLang } from '../../pi/util/lang';
import { Config, ERC20Tokens } from '../config';
import { BTCWallet } from '../core/btc/wallet';
import { ibanToAddress, isValidIban } from '../core/eth/helper';
import { EthWallet } from '../core/eth/wallet';
import { toMnemonic } from '../core/genmnemonic';
import { buyProduct, getPurchaseRecord, getServerCloudBalance } from '../net/pull';
import { getStore, setStore } from '../store/memstore';
import { decrypt, encrypt, sha256 } from './cipherTools';
import { defaultGasLimit, lang, MAX_SHARE_LEN, MIN_SHARE_LEN, timeOfArrival } from './constants';
import { shareSecret } from './secretsBase';
// tslint:disable-next-line:max-line-length
import { calcHashValuePromise, fetchBtcMinerFee, fetchGasPrice, hexstrToU8Array, popNewLoading, popNewMessage } from './tools';
import { sat2Btc, wei2Eth } from './unitTools';

/**
 * 获取新的地址信息
 * @param currencyName 货币类型
 */
export const getNewAddrInfo = (currencyName, wallet) => {
    const currencyRecord = wallet.currencyRecords.filter(v => v.currencyName === currencyName)[0];
    if (!currencyRecord) return;
    const addrs = getStore('addrs') || [];
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
 * 验证当前账户身份
 */
export const VerifyIdentidy = async (passwd:string) => {
    const wallet = getStore('wallet');
    const hash = await calcHashValuePromise(passwd, getStore('user/salt'));

    try {
        decrypt(wallet.vault,hash);
        
        return hash;
    } catch (error) {
        console.log(error);

        return '';
    }
};

/**
 * 验证某个账户身份
 */
export const VerifyIdentidy1 = async (passwd:string,vault:string,salt:string) => {
    const hash = await calcHashValuePromise(passwd, salt);

    try {
        decrypt(vault,hash);

        return hash;
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
        return decrypt(wallet.vault,hash);
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
        if (record.currencyName === currencyName) {
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
    const close = popNewLoading(Config[getLang()].bugProduct.buying);  // 购买中  
    const secretHash = await VerifyIdentidy(psw);
    if (!secretHash) {
        close.callback(close.widget);
        popNewMessage(Config[getLang()].bugProduct.wrong);  // 密码错误  
        
        return;
    }
    const data = await buyProduct(productId,amount,secretHash);
    close.callback(close.widget);
    if (data) {
        popNewMessage(Config[getLang()].bugProduct.buySuccess); // 购买成功
        getServerCloudBalance();
        console.log('data',data);
        getPurchaseRecord();// 购买之后获取购买记录
    }
    
    return data;
};

// 获取助记词片段
export const fetchMnemonicFragment = async (hash) => {
    const mnemonicHexstr =  getMnemonicHexstr(hash);
    if (!mnemonicHexstr) return;

    return shareSecret(mnemonicHexstr, MAX_SHARE_LEN, MIN_SHARE_LEN)
            .map(v => arrayBufferToBase64(hexstrToU8Array(v).buffer));
    
};

// 备份助记词
export const backupMnemonic = async (passwd:string) => {
    const close = popNewLoading(Config[getLang()].userInfo.exporting);
    const hash = await calcHashValuePromise(passwd, getStore('user/salt'));
    console.log('hash!!!!!!!!!!!!',hash);
    close.callback(close.widget);
    const mnemonic = getMnemonicByHash(hash);
    const fragments = await fetchMnemonicFragment(hash);
    if (!mnemonic) {
        popNewMessage(Config[getLang()].transError[0]);
        
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
        const r = decrypt(wallet.vault,hash);

        return toMnemonic(lang, hexstrToU8Array(r));
    } catch (error) {
        console.log(error);

        return '';
    }
};

/**
 * 获取钱包地址的位置
 */
export const getWltAddrIndex = (addr: string, currencyName: string) => {
    
    const wallet = getStore('wallet');
    const currencyRecord = wallet.currencyRecords.filter(v => v.currencyName === currencyName)[0];
    const addrs = currencyRecord.addrs;
    for (let i = 0;i < addrs.length;i++) {
        if (addrs[i].addr.toLocaleLowerCase() === addr.toLocaleLowerCase()) {
            return i;
        }
    }
    
    return -1;
};

/**
 * 修改密码
 */
export const passwordChange = async (secretHash: string, newPsw: string) => {
    const salt = getStore('user/salt');
    const newHash = await calcHashValuePromise(newPsw, salt);
    const wallet = getStore('wallet');
    const oldVault = decrypt(wallet.vault, secretHash);
    wallet.vault = encrypt(oldVault, newHash);
    wallet.setPsw = true;
    setStore('wallet',wallet);
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