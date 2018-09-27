/**
 * 本地钱包相关操作
 */
import { popNew } from '../../pi/ui/root';
import { base64ToArrayBuffer } from '../../pi/util/base64';
import { drawImg } from '../../pi/util/canvas';
import { generateByHash, sha3, toMnemonic } from '../core/genmnemonic';
import { GlobalWallet } from '../core/globalWallet';
import { openAndGetRandom } from '../net/pull';
import { Addr, CreateWalletType, Wallet } from '../store/interface';
import { find, updateStore } from '../store/store';
import { ahash } from '../utils/ahash';
import { defalutShowCurrencys, lang } from '../utils/constants';
import { restoreSecret } from '../utils/secretsBase';
import { calcHashValuePromise, getXOR, hexstrToU8Array, u8ArrayToHexstr, popNewLoading, popNewMessage } from '../utils/tools';
import { getMnemonic, addNewAddr } from '../utils/walletTools';
import { dataCenter } from './dataCenter';

/**
 * 创建钱包
 * @param itype 创建钱包方式 1 随机 2 图片 3 标准导入 4 照片导入 5 片段导入
 * @param option 相关参数
 */
export const createWallet = async (itype:CreateWalletType,option:any) => {
    if (itype === CreateWalletType.Random) {
        const close = popNew('app-components1-loading-loading', { text: '创建中...' });
        const hash = await calcHashValuePromise(option.psw, find('salt'));
        createWalletRandom(hash,option);
        close.callback(close.widget);
        // 刷新本地钱包
        dataCenter.refreshAllTx();
        return hash;
    } else if (itype === CreateWalletType.Image) {
        const close = popNew('app-components1-loading-loading', { text: '创建中...' });
        const hash = await calcHashValuePromise(option.psw, find('salt'));
        await createWalletByImage(hash,option);
        close.callback(close.widget);
        // 刷新本地钱包
        dataCenter.refreshAllTx();
        return hash;
    } else if (itype === CreateWalletType.StrandarImport) {
        const close = popNew('app-components1-loading-loading', { text: '导入中...' });
        const hash = await calcHashValuePromise(option.psw, find('salt'));
        importWalletByMnemonic(hash,option);
        close.callback(close.widget);
        // 刷新本地钱包
        dataCenter.refreshAllTx();
        return hash;
    } else if (itype === CreateWalletType.ImageImport) {
        const close = popNew('app-components1-loading-loading', { text: '导入中...' });
        const hash = await calcHashValuePromise(option.psw, find('salt'));
        await createWalletByImage(hash,option);
        close.callback(close.widget);
        // 刷新本地钱包
        dataCenter.refreshAllTx();
        return hash;
    } else if (itype === CreateWalletType.FragmentImport) {
        const close = popNew('app-components1-loading-loading', { text: '导入中...' });
        const hash = await calcHashValuePromise(option.psw, find('salt'));
        importWalletByFragment(hash,option);
        close.callback(close.widget);
        // 刷新本地钱包
        dataCenter.refreshAllTx();
        return hash;
    }
   
};

/**
 * 随机创建钱包
 */
export const createWalletRandom = (hash:string,option) => {
    const salt = find('salt');
    const gwlt = GlobalWallet.generate(hash, option.nickName);
    // 创建钱包基础数据
    const wallet: Wallet = {
        walletId: gwlt.glwtId,
        avatar: '',
        gwlt: gwlt.toJSON(),
        showCurrencys: defalutShowCurrencys,
        currencyRecords: []
    };

    wallet.currencyRecords.push(...gwlt.currencyRecords);

    const walletList: Wallet[] = find('walletList');
    const addrs: Addr[] = find('addrs');
    addrs.push(...gwlt.addrs);
    updateStore('addrs', addrs);
    walletList.push(wallet);
    updateStore('walletList', walletList);
    updateStore('curWallet', wallet);
    updateStore('salt', salt);
    updateStore('userInfo',{ nickName:option.nickName,avatar:option.avatar,fromServer:false });

    openAndGetRandom();
};

/**
 * 图片创建钱包
 * @param option 参数
 */
export const createWalletByImage = async (hash:string,option:any) => {
    console.log('createWalletByImage-------',hash,option);
    const ahash:any = await getImageAhash(option.imageBase64);
    const vault = await imgToHash(ahash,option.imagePsw);
    console.log('ahash-------',ahash);
    console.log('vault-------',vault);
    const walletList: Wallet[] = find('walletList');
    const addrs: Addr[] = find('addrs');
    const salt = find('salt');
    const gwlt = GlobalWallet.generate(hash, option.nickName, vault);
    // 创建钱包基础数据
    const wallet: Wallet = {
        walletId: gwlt.glwtId,
        avatar: '',
        gwlt: gwlt.toJSON(),
        showCurrencys: defalutShowCurrencys,
        currencyRecords: []
    };

    wallet.currencyRecords.push(...gwlt.currencyRecords);

    addrs.push(...gwlt.addrs);
    updateStore('addrs', addrs);
    walletList.push(wallet);
    updateStore('walletList', walletList);
    updateStore('curWallet', wallet);
    updateStore('salt', salt);
    updateStore('userInfo',{ nickName:option.nickName,avatar:option.avatar,fromServer:false });

    openAndGetRandom();
};

/**
 * 获取图片ahash
 * @param imageBase64 base64
 */
const getImageAhash = (imageBase64:string) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const ab = drawImg(img);
            const r = ahash(new Uint8Array(ab), img.width, img.height, 4);
            resolve(r);
        };
        img.onerror = (e) => {
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
const imgToHash = async (ahash:string, imagePsw:string) => {
    const sha3Hash = sha3(ahash + imagePsw, false);
    const hash = await calcHashValuePromise(sha3Hash);
    const sha3Hash1 = sha3(hash, true);
    const len = sha3Hash1.length;
    // 生成助记词的随机数仅需要128位即可，这里对256位随机数进行折半取异或的处理
    const sha3Hash2 = getXOR(sha3Hash1.slice(0, len / 2), sha3Hash1.slice(len / 2));
    // console.log(choosedImg, inputWords, sha3Hash, hash, sha3Hash1, sha3Hash2);

    return generateByHash(sha3Hash2);

};

/**
 * 通过助记词导入钱包
 */
export const importWalletByMnemonic = (hash:string,option) => {
    const walletList: Wallet[] = find('walletList');
    const salt = find('salt');
    const addrs: Addr[] = find('addrs') || [];

    let gwlt = null;
    console.time('import');
    gwlt = GlobalWallet.fromMnemonic(hash,option.mnemonic);
    console.timeEnd('import');
   
    gwlt.nickName = option.nickName;

    const wallet: Wallet = {
        walletId: gwlt.glwtId,
        avatar: '',
        gwlt: gwlt.toJSON(),
        showCurrencys: defalutShowCurrencys,
        currencyRecords: []
    };
    wallet.currencyRecords.push(...gwlt.currencyRecords);

    addrs.push(...gwlt.addrs);
    updateStore('addrs', addrs);
    walletList.push(wallet);
    updateStore('walletList', walletList);
    updateStore('curWallet', wallet);
    
    updateStore('salt', salt);
    updateStore('userInfo',{ nickName:option.nickName,avatar:option.avatar,fromServer:false });
    openAndGetRandom();

    return true;
};

/**
 * 冗余助记词导入
 */
export const importWalletByFragment = async (hash:string,option) => {
    const shares = [option.fragment1, option.fragment2].map(v => u8ArrayToHexstr(new Uint8Array(base64ToArrayBuffer(v))));
    const comb = restoreSecret(shares);
    const mnemonic = toMnemonic(lang, hexstrToU8Array(comb));
    option.mnemonic = mnemonic;
    importWalletByMnemonic(hash,option);
};


/**
 * 添加新地址
 */
export const createNewAddr = async (passwd:string,currencyName:string) => {
    const close = popNewLoading('添加中...');
    const wallet = find('curWallet');
    const mnemonic = await getMnemonic(wallet, passwd);
    close.callback(close.widget);
    if (mnemonic) {
        const currencyRecord = wallet.currencyRecords.filter(v => v.currencyName === currencyName)[0];
        const address = GlobalWallet.getWltAddrByMnemonic(mnemonic, currencyName, currencyRecord.addrs.length);
        if (!address) return;
        addNewAddr(currencyName, address, '');
        popNewMessage('添加成功');
    } else {
        popNewMessage('密码错误');
    }
}

// 删除助记词
export const  deleteMnemonic = () =>{
    const curWalletId = find('curWallet').walletId;
    const walletList: Wallet[] = find('walletList').map(v => {
        if (v.walletId === curWalletId) {
            // isUpdate = true;
            const gwlt = GlobalWallet.fromJSON(v.gwlt);
            gwlt.mnemonicBackup = true;
            v.gwlt = gwlt.toJSON();
            updateStore('curWallet', v);
        }
        
        return v;
    });
    updateStore('walletList', walletList);
}