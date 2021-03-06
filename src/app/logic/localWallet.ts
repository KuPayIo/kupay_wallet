/**
 * 本地钱包相关操作
 */
import { base64ToArrayBuffer } from '../../pi/util/base64';
import { ERC20Tokens } from '../config';
import { AddrInfo, Wallet } from '../store/interface';
import { getStore, setStore } from '../store/memstore';
import { getAhashMod, getDataCenter, getGenmnemonicMod, getGlobalWalletClass, getSecretsBaseMod, piRequire } from '../utils/commonjsTools';
import { defalutShowCurrencys, lang } from '../utils/constants';
import { calcHashValuePromise,getMnemonic,getXOR,hexstrToU8Array,popNewLoading, popNewMessage, u8ArrayToHexstr } from '../utils/tools';

export interface Option {
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
        const close = popNewLoading({ zh_Hans:'创建中...',zh_Hant:'創建中...',en:'' });
        secrectHash = await createWalletRandom(option);
        close.callback(close.widget);
    } else if (itype === CreateWalletType.Image) {
        const close = popNewLoading({ zh_Hans:'创建中...',zh_Hant:'創建中...',en:'' });
        secrectHash = await createWalletByImage(option);
        close.callback(close.widget);
    } else if (itype === CreateWalletType.StrandarImport) {
        const close = popNewLoading({ zh_Hans:'导入中...',zh_Hant:'導入中...',en:'' });
        secrectHash = await importWalletByMnemonic(option);
        close.callback(close.widget);
    } else if (itype === CreateWalletType.ImageImport) {
        const close = popNewLoading({ zh_Hans:'导入中...',zh_Hant:'導入中...',en:'' });
        secrectHash = await createWalletByImage(option);
        close.callback(close.widget);
    } else if (itype === CreateWalletType.FragmentImport) {
        const close = popNewLoading({ zh_Hans:'导入中...',zh_Hant:'導入中...',en:'' });
        secrectHash = await importWalletByFragment(option);
        close.callback(close.widget);
    }

    // 刷新本地钱包
    getDataCenter().then(dataCenter => {
        dataCenter.refreshAllTx();
    });
    getDataCenter().then(dataCenter => {
        dataCenter.initErc20GasLimit();
    });

    return secrectHash;
};

/**
 * 游客登录创建钱包
 */
export const touristLogin = async (option: Option) => {
    const close = popNewLoading({ zh_Hans:'游客登录中',zh_Hant:'遊客登錄中',en:'' });
    let secrectHash;
    try {
        secrectHash = await createWalletRandom(option,true);
    } catch (err) {
        return '';
    } finally {
        close.callback(close.widget);
    }
    
    // 刷新本地钱包
    getDataCenter().then(dataCenter => {
        dataCenter.refreshAllTx();
    });
    getDataCenter().then(dataCenter => {
        dataCenter.initErc20GasLimit();
    });

    return secrectHash;
};

/**
 * 手机号导入
 */
export const phoneImport = async (option: Option) => {
    let secrectHash;
    try {
        secrectHash = await createWalletRandom(option,true);
    } catch (err) {
        return '';
    }

    return secrectHash;
};
/**
 * 随机创建钱包
 */
export const createWalletRandom = async (option: Option,tourist?:boolean) => {
    const secrectHashPromise = calcHashValuePromise(option.psw,getStore('user/salt'));
    const GlobalWalletPromise = getGlobalWalletClass();
    const [secrectHash,GlobalWallet] = await Promise.all([secrectHashPromise,GlobalWalletPromise]);
    const gwlt = GlobalWallet.generate(secrectHash);
    // 创建钱包基础数据
    const wallet: Wallet = {
        vault: gwlt.vault,
        setPsw:tourist ? false : true,
        backupTip:false,
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
export const createWalletByImage = async (option: Option) => {
    const secrectHashPromise = calcHashValuePromise(option.psw,getStore('user/salt'));

    const imgArgon2HashPromise = getStore('flags').imgArgon2HashPromise;

    const GlobalWalletPromise = getGlobalWalletClass();
    
    console.time('pi_create Promise all need');
    const [secrectHash,vault,GlobalWallet] = await Promise.all([secrectHashPromise,imgArgon2HashPromise,GlobalWalletPromise]);
    console.timeEnd('pi_create Promise all need');
    
    console.time('pi_create GlobalWallet generate need');
    const gwlt = GlobalWallet.generate(secrectHash, vault);
    console.timeEnd('pi_create GlobalWallet generate need');
    // 创建钱包基础数据
    const wallet: Wallet = {
        vault: gwlt.vault,
        setPsw:true,
        backupTip:false,
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
 * 获取图片ahash
 * @param imageBase64 base64
 */
const getImageAhash = (imageBase64: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            piRequire(['pi/util/canvas']).then(mods => {
                const drawImg = mods[0].drawImg;
                const ab = drawImg(img);
                getAhashMod().then(ahashMod => {
                    const r = ahashMod.ahash(new Uint8Array(ab), img.width, img.height, 4);
                    resolve(r);
                });
            });
        };
        img.onerror = e => {
            reject(e);
        };
        img.crossOrigin = 'Anonymous';
        img.src = imageBase64;
    });
};

/**
 *
 * @param imagePsw 图片密码
 * @param ahash ahash
 */
export const ahashToArgon2Hash = async (ahash: string, imagePsw: string) => {
    const genmnemonic = await getGenmnemonicMod(); 
    const sha3Hash = await genmnemonic.sha3(ahash + imagePsw, false);
    const hash = await calcHashValuePromise(sha3Hash);
    const sha3Hash1 = await genmnemonic.sha3(hash, true);
    
    const len = sha3Hash1.length;
    // 生成助记词的随机数仅需要128位即可，这里对256位随机数进行折半取异或的处理
    const sha3Hash2 = getXOR(sha3Hash1.slice(0, len / 2),sha3Hash1.slice(len / 2));

    return genmnemonic.generateByHash(sha3Hash2);
};

/**
 * 计算图片Argon2 Hash
 */
export const calcImgArgon2Hash = async (imageBase64: string,imagePsw: string) => {
    const ahash = await getImageAhash(imageBase64);

    return ahashToArgon2Hash(ahash, imagePsw);
};

/**
 * 通过助记词导入钱包
 */
export const importWalletByMnemonic = async (option: Option) => {
    const secrectHashPromise = calcHashValuePromise(option.psw,getStore('user/salt'));
    const GlobalWalletPromise = getGlobalWalletClass();
    const [secrectHash,GlobalWallet] = await Promise.all([secrectHashPromise,GlobalWalletPromise]);
    const gwlt = GlobalWallet.fromMnemonic(secrectHash, option.mnemonic);
  // 创建钱包基础数据
    const wallet: Wallet = {
        vault: gwlt.vault,
        setPsw:true,
        backupTip:false,
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
export const importWalletByFragment = async (option: Option) => {
    const shares = [option.fragment1, option.fragment2].map(v =>
    u8ArrayToHexstr(new Uint8Array(base64ToArrayBuffer(v)))
  );
    const secretsBasePromise = getSecretsBaseMod();
    const genmnemonicPromise = getGenmnemonicMod();
    const [secretsBase,genmnemonic] = await Promise.all([secretsBasePromise,genmnemonicPromise]);
    const comb = secretsBase.restoreSecret(shares);
    
    const mnemonic = await genmnemonic.toMnemonic(lang, hexstrToU8Array(comb));
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
    const GlobalWalletPromise = getGlobalWalletClass();
    const [GlobalWallet] = await Promise.all([GlobalWalletPromise]);
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
        const dataCenter = await getDataCenter();
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
    setStore('wallet/isBackup',true);
};

// 记录通过分享片段备份
export const sharePart = () => {
    setStore('wallet/sharePart',true);
};

// 记录通过助计词备份
export const helpWord = () => {
    setStore('wallet/helpWord',true);
};