/**
 * 本地钱包相关操作
 */
// tslint:disable-next-line:max-line-length
import { callCreateNewAddr, callCreateWalletByImage, callCreateWalletRandom, callGetDataCenter, callImportWalletByFragment, callImportWalletByMnemonic } from '../middleLayer/walletBridge';
import { CreateWalletOption } from '../store/interface';
import { popNewLoading, popNewMessage } from '../utils/tools';

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
export const createWallet = async (itype: CreateWalletType, option: CreateWalletOption) => {
    let secrectHash;
    if (itype === CreateWalletType.Random) {
        const close = popNewLoading({ zh_Hans:'创建中...',zh_Hant:'創建中...',en:'' });
        secrectHash = await callCreateWalletRandom(option);
        close.callback(close.widget);
    } else if (itype === CreateWalletType.Image) {
        const close = popNewLoading({ zh_Hans:'创建中...',zh_Hant:'創建中...',en:'' });
        secrectHash = await callCreateWalletByImage(option);
        close.callback(close.widget);
    } else if (itype === CreateWalletType.StrandarImport) {
        const close = popNewLoading({ zh_Hans:'导入中...',zh_Hant:'導入中...',en:'' });
        secrectHash = await callImportWalletByMnemonic(option);
        close.callback(close.widget);
    } else if (itype === CreateWalletType.ImageImport) {
        const close = popNewLoading({ zh_Hans:'导入中...',zh_Hant:'導入中...',en:'' });
        secrectHash = await callCreateWalletByImage(option);
        close.callback(close.widget);
    } else if (itype === CreateWalletType.FragmentImport) {
        const close = popNewLoading({ zh_Hans:'导入中...',zh_Hant:'導入中...',en:'' });
        secrectHash = await callImportWalletByFragment(option);
        close.callback(close.widget);
    }

    // 刷新本地钱包
    callGetDataCenter().then(dataCenter => {
        dataCenter.refreshAllTx();
    });
    callGetDataCenter().then(dataCenter => {
        dataCenter.initErc20GasLimit();
    });

    return secrectHash;
};

/**
 * 游客登录创建钱包
 */
export const touristLogin = async (option: CreateWalletOption) => {
    const close = popNewLoading({ zh_Hans:'游客登录中',zh_Hant:'遊客登錄中',en:'' });
    let secrectHash;
    try {
        secrectHash = await callCreateWalletRandom(option,true);
    } catch (err) {
        return '';
    } finally {
        close.callback(close.widget);
    }
    
    // 刷新本地钱包
    callGetDataCenter().then(dataCenter => {
        dataCenter.refreshAllTx();
    });

    callGetDataCenter().then(dataCenter => {
        dataCenter.initErc20GasLimit();
    });

    return secrectHash;
};

/**
 * 手机号导入
 */
export const phoneImport = async (option: CreateWalletOption) => {
    let secrectHash;
    try {
        secrectHash = await callCreateWalletRandom(option,true);
    } catch (err) {
        return '';
    }

    return secrectHash;
};

/**
 * 创建新地址
 */
export const createNewAddr = async (passwd: string, currencyName: string) => {
    const close = popNewLoading({ zh_Hans:'添加中...',zh_Hant:'添加中...',en:'' });
    callCreateNewAddr(passwd,currencyName).then(() => {
        close.callback(close.widget);
        popNewMessage({ zh_Hans:'添加成功',zh_Hant:'添加成功',en:'' });
    }).catch(() => {
        close.callback(close.widget);
        popNewMessage({ zh_Hans:'密码错误',zh_Hant:'密碼錯誤',en:'' });
    });
};
