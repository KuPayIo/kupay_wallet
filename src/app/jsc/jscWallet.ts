import { ArgonHash } from '../../pi/browser/argonHash';
import { drawImg } from '../../pi/util/canvas';
import { GlobalWallet } from '../core/globalWallet';
import { CreateWalletOption, Wallet } from '../store/interface';
import { getStore, setStore } from '../store/memstore';
import { defalutShowCurrencys } from '../utils/constants';
import { ahash } from './ahash';
import { dataCenter } from './jscDataCenter';

/**
 * 获取memery hash
 */
export const calcHashValue = async (pwd, salt?) => {
    const argonHash = new ArgonHash();
    argonHash.init();
    const secretHash = await argonHash.calcHashValuePromise({ pwd, salt });
    dataCenter.checkAddr(secretHash);

    return secretHash;
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