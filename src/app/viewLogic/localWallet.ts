/**
 * 本地钱包相关操作
 */
import { popModalBoxs, popNew } from '../../pi/ui/root';
import { getLang } from '../../pi/util/lang';
import { Config } from '../config';
import { callGetAllAccount } from '../middleLayer/memBridge';
import { callGetServerCloudBalance } from '../middleLayer/netBridge';
// tslint:disable-next-line:max-line-length
import { callBackupMnemonic, callCreateNewAddr, callCreateWalletByImage, callCreateWalletRandom, callGetDataCenter, callImportWalletByFragment, callImportWalletByMnemonic, callVerifyIdentidy } from '../middleLayer/walletBridge';
import { buyProduct, getPurchaseRecord } from '../net/pull';
import { CreateWalletOption } from '../publicLib/interface';
import { closeAllPage, getPopPhoneTips, getStaticLanguage, popNewLoading, popNewMessage } from '../utils/tools';

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

// 备份助记词
export const backupMnemonic = async (passwd:string) => {
    const close = popNewLoading(Config[getLang()].userInfo.exporting);
    const ret = await callBackupMnemonic(passwd);
    close.callback(close.widget);
    if (!ret.mnemonic) {
        popNewMessage(Config[getLang()].transError[0]);
        
        return;
    }

    return ret;
};

// 购买理财
export const purchaseProduct = async (psw:string,productId:string,amount:number) => {
    const close = popNewLoading(Config[getLang()].bugProduct.buying);  // 购买中  
    const secretHash = await callVerifyIdentidy(psw);
    if (!secretHash) {
        close.callback(close.widget);
        popNewMessage(Config[getLang()].bugProduct.wrong);  // 密码错误  
        
        return;
    }
    const data = await buyProduct(productId,amount,secretHash);
    close.callback(close.widget);
    if (data) {
        popNewMessage(Config[getLang()].bugProduct.buySuccess); // 购买成功
        callGetServerCloudBalance();
        console.log('data',data);
        getPurchaseRecord();// 购买之后获取购买记录
    }
    
    return data;
};

// 强制被踢下线
export const forceOffline = () => {
    popNew('app-components-modalBox-modalBox',{
        sureText:{ zh_Hans:'重新登录',zh_Hant:'重新登錄',en:'' },
        cancelText:{ zh_Hans:'退出',zh_Hant:'退出',en:'' },
        title:{ zh_Hans:'下线通知',zh_Hant:'下線通知',en:'' },
        content:{ zh_Hans:'您的账户已被下线，如非本人操作，则助记词可能已泄露。',zh_Hant:'您的賬戶已被下線，如非本人操作，則助記詞可能已洩露。',en:'' }
    }, () => {
        setTimeout(async () => {
            closeAllPage();
            const accounts = await callGetAllAccount();
            if (accounts.length > 0) {
                popNew('app-view-base-entrance1');
            } else {
                popNew('app-view-base-entrance');
            }
        },100);
    },() => {
        setTimeout(async () => {
            closeAllPage();
            const accounts = await callGetAllAccount();
            if (accounts.length > 0) {
                popNew('app-view-base-entrance1');
            } else {
                popNew('app-view-base-entrance');
            }
        },100);
    });
};

// 充值成功
export const payOk = () => {
    popNewMessage(getStaticLanguage().transfer.rechargeTips);
};

// 设置密码弹框
export const setPswPop = () => {
    setTimeout(() => {
        const modalBox = { 
            zh_Hans:{
                title:'设置密码',
                content:'为了您的资产安全，请您立即设置支付密码',
                sureText:'去设置',
                onlyOk:true
            },
            zh_Hant:{
                title:'設置密碼',
                content:'為了您的資產安全，請您立即設置支付密碼',
                sureText:'去設置',
                onlyOk:true
            },
            en:'' 
        };
        popModalBoxs('app-components-modalBox-modalBox',modalBox[getLang()],() => {  
            popNew('app-view-mine-setting-settingPsw',{});
        },undefined,true);
        
    },3000);
};

// 绑定手机弹框
export const bindPhonePop = () => {
    setTimeout(() => {
        popModalBoxs('app-components-modalBox-modalBox',getPopPhoneTips(),() => { 
            popNew('app-view-mine-setting-phone',{ jump:true });
        },undefined,true);      
    },3000);
};