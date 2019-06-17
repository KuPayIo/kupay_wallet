import { ArgonHash } from '../../pi/browser/argonHash';
import { arrayBufferToBase64, base64ToArrayBuffer } from '../../pi/util/base64';
import { drawImg } from '../../pi/util/canvas';
import { BTCWallet } from '../core/btc/wallet';
import { Cipher } from '../core/crypto/cipher';
import { ibanToAddress, isValidIban } from '../core/eth/helper';
import { EthWallet } from '../core/eth/wallet';
import { generateByHash, sha3, toMnemonic } from '../core/genmnemonic';
import { GlobalWallet } from '../core/globalWallet';
import { btcNetwork, defalutShowCurrencys, defaultGasLimit, ERC20Tokens, lang, MAX_SHARE_LEN, MIN_SHARE_LEN, timeOfArrival } from '../publicLib/config';
import { AddrInfo, CreateWalletOption, MinerFeeLevel, Wallet } from '../publicLib/interface';
import { getAddrInfoByAddr, getXOR, hexstrToU8Array, u8ArrayToHexstr } from '../publicLib/tools';
import { sat2Btc, wei2Eth } from '../publicLib/unitTools';
import { getStore, setStore } from '../store/memstore';
import { ahash } from './ahash';
import { dataCenter } from './dataCenter';
import { restoreSecret, shareSecret } from './secretsBase';
import { getCurrentAddrInfo } from './tools';

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

/**
 * 获取memery hash
 */
export const calcHashValue = (pwd, salt?) => {
    const argonHash = new ArgonHash();
    argonHash.init();

    return argonHash.calcHashValuePromise({ pwd, salt });
};

/**
 * 获取图片ahash
 * @param imageBase64 base64
 */
export const getImageAhash = (imageBase64: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const ab = drawImg(img);
            const r = ahash(new Uint8Array(ab), img.width, img.height, 4);
            resolve(r);
        };
        img.onerror = e => {
            reject(e);
        };
        img.crossOrigin = 'Anonymous';
        img.src = imageBase64;
    });
};

/**
 * 验证当前账户身份
 */
export const VerifyIdentidy = async (passwd:string) => {
    const wallet = getStore('wallet');
    const hash = await calcHashValue(passwd, getStore('user/salt'));

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
    const hash = await calcHashValue(passwd, salt);

    try {
        decrypt(vault,hash);

        return hash;
    } catch (error) {
        console.log(error);

        return '';
    }
};
/**
 * 随机创建钱包
 */
export const createWalletRandom = async (option: CreateWalletOption,tourist?:boolean) => {
    const secrectHash = await calcHashValue(option.psw,getStore('user/salt'));
    const gwlt = GlobalWallet.generate(secrectHash);
    // 创建钱包基础数据
    const wallet: Wallet = {
        vault: gwlt.vault,
        setPsw:tourist ? false : true,
        isBackup: gwlt.isBackup,
        sharePart:false,
        helpWord:false,
        showCurrencys: defalutShowCurrencys,
        currencyRecords: gwlt.currencyRecords,
        changellyPayinAddress:[],
        changellyTempTxs:[]
    };
    const user = getStore('user');
    user.id = gwlt.glwtId;
    user.publicKey = gwlt.publicKey;
    user.info = {
        ...user.info,
        nickName: option.nickName
    };
    setStore('wallet', wallet,false);
    setStore('user', user);

    return secrectHash;
};

/**
 * 图片创建钱包
 * @param option 参数
 */
export const createWalletByImage = async (option: CreateWalletOption) => {
    const secrectHashPromise = calcHashValue(option.psw,getStore('user/salt'));

    const imgArgon2HashPromise = getStore('flags').imgArgon2HashPromise;

    console.time('pi_create Promise all need');
    const [secrectHash,vault] = await Promise.all([secrectHashPromise,imgArgon2HashPromise]);
    console.timeEnd('pi_create Promise all need');
    
    console.time('pi_create GlobalWallet generate need');
    const gwlt = GlobalWallet.generate(secrectHash, vault);
    console.timeEnd('pi_create GlobalWallet generate need');
    // 创建钱包基础数据
    const wallet: Wallet = {
        vault: gwlt.vault,
        setPsw:true,
        isBackup: gwlt.isBackup,
        sharePart:false,
        helpWord:false,
        showCurrencys: defalutShowCurrencys,
        currencyRecords: gwlt.currencyRecords,
        changellyPayinAddress:[],
        changellyTempTxs:[]
    };
    const user = getStore('user');
    user.id = gwlt.glwtId;
    user.publicKey = gwlt.publicKey;
    user.info = {
        ...user.info,
        nickName: option.nickName
    };
    setStore('wallet', wallet,false);
    setStore('user', user);

    return secrectHash;
};

/**
 * 通过助记词导入钱包
 */
export const importWalletByMnemonic = async (option: CreateWalletOption) => {
    const secrectHash = await calcHashValue(option.psw,getStore('user/salt'));
    const gwlt = GlobalWallet.fromMnemonic(secrectHash, option.mnemonic);
  // 创建钱包基础数据
    const wallet: Wallet = {
        vault: gwlt.vault,
        setPsw:true,
        isBackup: gwlt.isBackup,
        sharePart:false,
        helpWord:false,
        showCurrencys: defalutShowCurrencys,
        currencyRecords: gwlt.currencyRecords,
        changellyPayinAddress:[],
        changellyTempTxs:[]
    };
    const user = getStore('user');
    user.id = gwlt.glwtId;
    user.publicKey = gwlt.publicKey;
    user.info = {
        ...user.info,
        nickName: option.nickName
    };
    setStore('wallet', wallet,false);
    setStore('user', user);
    
    return secrectHash;
};

/**
 * 冗余助记词导入
 */
export const importWalletByFragment = async (option: CreateWalletOption) => {
    const shares = [option.fragment1, option.fragment2].map(v =>
        u8ArrayToHexstr(new Uint8Array(base64ToArrayBuffer(v)))
    );
    const comb = restoreSecret(shares);
    
    const mnemonic = await toMnemonic(lang, hexstrToU8Array(comb));
    option.mnemonic = mnemonic;
    // tslint:disable-next-line:no-unnecessary-local-variable
    const secretHash = await importWalletByMnemonic(option);

    return secretHash;
};

/**
 * ahash to argonhash
 * @param imagePsw 图片密码
 * @param ahash ahash
 */
export const ahashToArgon2Hash = async (ahash: string, imagePsw: string) => {
    const sha3Hash = sha3(ahash + imagePsw, false);
    const hash = await calcHashValue(sha3Hash);
    const sha3Hash1 = sha3(hash, true);
    
    const len = sha3Hash1.length;
    // 生成助记词的随机数仅需要128位即可，这里对256位随机数进行折半取异或的处理
    const sha3Hash2 = getXOR(sha3Hash1.slice(0, len / 2),sha3Hash1.slice(len / 2));

    return generateByHash(sha3Hash2);
};

/**
 * 计算图片Argon2 Hash
 */
export const calcImgArgon2Hash = async (imageBase64: string,imagePsw: string) => {
    const ahash = await getImageAhash(imageBase64);

    return ahashToArgon2Hash(ahash, imagePsw);
};

/**
 * 获取助记词
 */
export const getMnemonic = async (passwd:string) => {
    const wallet = getStore('wallet');
    const hash = await calcHashValue(passwd, getStore('user/salt'));
    try {
        const r = decrypt(wallet.vault,hash);
        
        return toMnemonic(lang, hexstrToU8Array(r));
    } catch (error) {
        console.log(error);

        return '';
    }
};

/**
 * 创建新地址
 */
export const createNewAddr = async (passwd: string, currencyName: string) => {
    const wallet = getStore('wallet');
    const mnemonic = await getMnemonic(passwd);
    if (mnemonic) {
        const record = wallet.currencyRecords.filter(v => v.currencyName === currencyName)[0];
        const address = GlobalWallet.getWltAddrByMnemonic(mnemonic,currencyName,record.addrs.length);
        const addrInfo:AddrInfo = {
            addr:address,
            balance: 0,             
            txHistory: [],         
            nonce: 0
        };
        record.addrs.push(addrInfo);
        record.currentAddr = address;
        dataCenter.updateAddrInfo(address, currencyName);
        if (ERC20Tokens[currencyName]) {
            dataCenter.fetchErc20GasLimit(currencyName);
        }
        setStore('wallet/currencyRecords',wallet.currencyRecords);
        
        return true;
    } else {
        return false;
    }
};

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

// 获取助记词片段
export const fetchMnemonicFragment = (hash) => {
    const mnemonicHexstr =  getMnemonicHexstr(hash);
    if (!mnemonicHexstr) return;

    return shareSecret(mnemonicHexstr, MAX_SHARE_LEN, MIN_SHARE_LEN)
            .map(v => arrayBufferToBase64(hexstrToU8Array(v).buffer));
    
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
    const newHash = await calcHashValue(newPsw, salt);
    const wallet = getStore('wallet');
    const oldVault = decrypt(wallet.vault, secretHash);
    wallet.vault = encrypt(oldVault, newHash);
    wallet.setPsw = true;
    setStore('wallet',wallet);
};

// 获取矿工费
export const fetchMinerFeeList = (currencyName:string) => {
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

// 获取gasPrice
export const fetchGasPrice = (minerFeeLevel: MinerFeeLevel) => {
    return getStore('third/gasPrice')[minerFeeLevel];
};

// 获取btc miner fee
export const fetchBtcMinerFee = (minerFeeLevel: MinerFeeLevel) => {
    return getStore('third/btcMinerFee')[minerFeeLevel];
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

// 备份助记词
export const backupMnemonic = async (passwd:string,needFragments:boolean = true) => {
    const hash = await calcHashValue(passwd, getStore('user/salt'));
    console.log('hash!!!!!!!!!!!!',hash);
    const mnemonic = getMnemonicByHash(hash);
    if (!mnemonic) {
        throw new Error('psw error');        
    }
    let fragments = [];
    if (needFragments) {
        fragments = fetchMnemonicFragment(hash);
    }
    
    return {
        mnemonic,
        fragments
    };
};

/**
 * 增加或者删除展示的币种
 */
export const updateShowCurrencys = (currencyName:string,added:boolean) => {
    const wallet = getStore('wallet');
    const showCurrencys = wallet.showCurrencys || [];
    const oldIndex = showCurrencys.indexOf(currencyName);
    if (added && oldIndex < 0) {
        showCurrencys.push(currencyName);
        const curAddr = getCurrentAddrInfo(currencyName);
        dataCenter.updateAddrInfo(curAddr.addr, currencyName);
        dataCenter.fetchErc20GasLimit(currencyName);
    } else {
        showCurrencys.splice(oldIndex, 1);
    }
    wallet.showCurrencys = showCurrencys;

    setStore('wallet', wallet);
};

// 导出以太坊私钥
export const exportETHPrivateKey = (mnemonic:string,addrs: AddrInfo[]) => {
    const keys = [];
    const firstWlt = EthWallet.fromMnemonic(mnemonic, lang);
    const currencyRecords = getStore('wallet/currencyRecords');
    for (let j = 0; j < addrs.length; j++) {
        const wlt = firstWlt.selectAddressWlt(j);
        const privateKey = wlt.exportPrivateKey();
        const addr = addrs[j];
        const addrInfo = getAddrInfoByAddr(currencyRecords,addr.addr,'ETH');
        const balance = addrInfo.balance;
        keys.push({ addr:addr.addr,balance,privateKey });
    }

    return keys;
};

 // 导出BTC私钥
export const exportBTCPrivateKey = (mnemonic:string,addrs: AddrInfo[]) => {
    const keys = [];
    const currencyRecords = getStore('wallet/currencyRecords');
    const wlt = BTCWallet.fromMnemonic(mnemonic, btcNetwork, lang);
    wlt.unlock();
    for (let j = 0; j < addrs.length; j++) {
        const privateKey = wlt.privateKeyOf(j);
        const addr = addrs[j];
        const addrInfo = getAddrInfoByAddr(currencyRecords,addr.addr,'BTC');
        const balance = addrInfo.balance;
        keys.push({ addr:addr.addr,balance,privateKey });
    }
    wlt.lock();

    return keys;
};

// 导出ERC20私钥
export const exportERC20TokenPrivateKey = (mnemonic:string,addrs: AddrInfo[],currencyName:string) => {
    const keys = [];
    const currencyRecords = getStore('wallet/currencyRecords');
    const firstWlt = EthWallet.fromMnemonic(mnemonic, lang);
    for (let j = 0; j < addrs.length; j++) {
        const wlt = firstWlt.selectAddressWlt(j);
        const privateKey = wlt.exportPrivateKey();
        const addr = addrs[j];
        const balance = getAddrInfoByAddr(currencyRecords,addr.addr,currencyName).balance;
        keys.push({ addr:addr.addr,balance,privateKey });
    }

    return keys;
    
};