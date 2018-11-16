/**
 * 本地钱包相关操作
 */
import { popNew } from '../../pi/ui/root';
import { base64ToArrayBuffer } from '../../pi/util/base64';
import { drawImg } from '../../pi/util/canvas';
import { ERC20Tokens } from '../config';
import { generateByHash, sha3, toMnemonic } from '../core/genmnemonic';
import { GlobalWallet } from '../core/globalWallet';
import { AddrInfo, Wallet } from '../store/interface';
import { getStore, setStore } from '../store/memstore';
import { ahash } from '../utils/ahash';
import { defalutShowCurrencys, lang } from '../utils/constants';
import { restoreSecret } from '../utils/secretsBase';
// tslint:disable-next-line:max-line-length
import { calcHashValuePromise,getCurrentAddrInfo,getXOR,hexstrToU8Array,popNewLoading,popNewMessage, u8ArrayToHexstr } from '../utils/tools';
import { getMnemonic } from '../utils/walletTools';
import { dataCenter } from './dataCenter';

interface Option {
    psw: string; // 密码
    nickName: string; // 昵称
    imageBase64?: string; // 图片base64
    imagePsw?: string; // 图片密码
    mnemonic?: string; // 助记词
    fragment1?: string; // 片段1
    fragment2?: string; // 片段2
}

/**
 * 创建钱包的方式
 */
export enum CreateWalletType {
  Random = 1, // 普通随机创建
  Image, // 通过图片创建
  StrandarImport, // 普通导入
  ImageImport, // 图片导入
  FragmentImport // 片段导入
}

/**
 * 创建钱包
 * @param itype 创建钱包方式 1 随机 2 图片 3 标准导入 4 照片导入 5 片段导入
 * @param option 相关参数
 */
export const createWallet = async (itype: CreateWalletType, option: Option) => {
    let secrectHash;
    if (itype === CreateWalletType.Random) {
        const close = popNew('app-components1-loading-loading', {
            text: { zh_Hans:'创建中...',zh_Hant:'創建中...',en:'' }
        });
        secrectHash = await createWalletRandom(option);
        close.callback(close.widget);
    } else if (itype === CreateWalletType.Image) {
        const close = popNew('app-components1-loading-loading', {
            text: { zh_Hans:'创建中...',zh_Hant:'創建中...',en:'' }
        });
        secrectHash = await createWalletByImage(option);
        close.callback(close.widget);
    } else if (itype === CreateWalletType.StrandarImport) {
        const close = popNew('app-components1-loading-loading', {
            text: { zh_Hans:'导入中...',zh_Hant:'導入中...',en:'' }
        });
        secrectHash = await importWalletByMnemonic(option);
        close.callback(close.widget);
    } else if (itype === CreateWalletType.ImageImport) {
        const close = popNew('app-components1-loading-loading', {
            text: { zh_Hans:'导入中...',zh_Hant:'導入中...',en:'' }
        });
        secrectHash = await createWalletByImage(option);
        close.callback(close.widget);
    } else if (itype === CreateWalletType.FragmentImport) {
        const close = popNew('app-components1-loading-loading', {
            text: { zh_Hans:'导入中...',zh_Hant:'導入中...',en:'' }
        });
        secrectHash = await importWalletByFragment(option);
        close.callback(close.widget);
    }

    // 刷新本地钱包
    dataCenter.refreshAllTx();
    dataCenter.initErc20GasLimit();

    return secrectHash;
};

/**
 * 随机创建钱包
 */
export const createWalletRandom = async (option: Option) => {
    const secrectHash = await calcHashValuePromise(option.psw,getStore('user/salt'));
    const gwlt = GlobalWallet.generate(secrectHash);
    // 创建钱包基础数据
    const wallet: Wallet = {
        vault: gwlt.vault,
        isBackup: gwlt.isBackup,
        showCurrencys: defalutShowCurrencys,
        currencyRecords: gwlt.currencyRecords
    };
    const user = getStore('user');
    user.id = gwlt.glwtId;
    user.publicKey = gwlt.publicKey;
    user.secretHash = secrectHash;
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
export const createWalletByImage = async (option: Option) => {
    const secrectHash = await calcHashValuePromise(option.psw,getStore('user/salt'));
    const ahash = await getImageAhash(option.imageBase64);
    const vault = await imgToHash(ahash, option.imagePsw);
    const gwlt = GlobalWallet.generate(secrectHash, vault);
    // 创建钱包基础数据
    const wallet: Wallet = {
        vault: gwlt.vault,
        isBackup: gwlt.isBackup,
        showCurrencys: defalutShowCurrencys,
        currencyRecords: gwlt.currencyRecords
    };
    const user = getStore('user');
    user.id = gwlt.glwtId;
    user.publicKey = gwlt.publicKey;
    user.secretHash = secrectHash;
    user.info = {
        ...user.info,
        nickName: option.nickName
    };
    setStore('wallet', wallet,false);
    setStore('user', user);

    return secrectHash;
};

/**
 * 获取图片ahash
 * @param imageBase64 base64
 */
const getImageAhash = (imageBase64: string): Promise<string> => {
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
        img.src = imageBase64;
    });
};

/**
 *
 * @param imagePsw 图片密码
 * @param ahash ahash
 */
const imgToHash = async (ahash: string, imagePsw: string) => {
    const sha3Hash = sha3(ahash + imagePsw, false);
    const hash = await calcHashValuePromise(sha3Hash);
    const sha3Hash1 = sha3(hash, true);
    const len = sha3Hash1.length;
  // 生成助记词的随机数仅需要128位即可，这里对256位随机数进行折半取异或的处理
    const sha3Hash2 = getXOR(
    sha3Hash1.slice(0, len / 2),
    sha3Hash1.slice(len / 2)
  );
  // console.log(choosedImg, inputWords, sha3Hash, hash, sha3Hash1, sha3Hash2);

    return generateByHash(sha3Hash2);
};

/**
 * 通过助记词导入钱包
 */
export const importWalletByMnemonic = async (option: Option) => {
    const secrectHash = await calcHashValuePromise(
    option.psw,
    getStore('user/salt')
  );
    const gwlt = GlobalWallet.fromMnemonic(secrectHash, option.mnemonic);
  // 创建钱包基础数据
    const wallet: Wallet = {
        vault: gwlt.vault,
        isBackup: gwlt.isBackup,
        showCurrencys: defalutShowCurrencys,
        currencyRecords: gwlt.currencyRecords
    };
    const user = getStore('user');
    user.id = gwlt.glwtId;
    user.publicKey = gwlt.publicKey;
    user.secretHash = secrectHash;
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
export const importWalletByFragment = async (option: Option) => {
    const shares = [option.fragment1, option.fragment2].map(v =>
    u8ArrayToHexstr(new Uint8Array(base64ToArrayBuffer(v)))
  );
    const comb = restoreSecret(shares);
    const mnemonic = toMnemonic(lang, hexstrToU8Array(comb));
    option.mnemonic = mnemonic;
    // tslint:disable-next-line:no-unnecessary-local-variable
    const secretHash = await importWalletByMnemonic(option);

    return secretHash;
};

/**
 * 创建新地址
 */
export const createNewAddr = async (passwd: string, currencyName: string) => {
    const close = popNewLoading({ zh_Hans:'添加中...',zh_Hant:'添加中...',en:'' });
    const wallet = getStore('wallet');
    const mnemonic = await getMnemonic(passwd);
    close.callback(close.widget);
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
        popNewMessage({ zh_Hans:'添加成功',zh_Hant:'添加成功',en:'' });
    } else {
        popNewMessage({ zh_Hans:'密码错误',zh_Hant:'密碼錯誤',en:'' });
    }
};

// 删除助记词
export const deleteMnemonic = () => {
    const wallet = getStore('wallet');
    wallet.isBackup = true;
    setStore('wallet',wallet);
};

/**
 * 获取第一个ETH地址
 */
export const getFirstEthAddr = () => {
    return getStore('user/id');
};

/**
 * 获取当前正在使用的ETH地址
 */
export const getCurrentEthAddr = () => {
    return getCurrentAddrInfo('ETH').addr;
};