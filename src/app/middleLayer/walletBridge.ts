import { GlobalWallet } from '../core/globalWallet';
import { dataCenter } from '../jsc/jscDataCenter';
// tslint:disable-next-line:max-line-length
import { backupMnemonic, calcHashValue, createNewAddr, createWalletByImage, createWalletRandom, importWalletByFragment, importWalletByMnemonic, VerifyIdentidy, VerifyIdentidy1 } from '../jsc/jscWallet';
import { CreateWalletOption } from '../store/interface';

/**
 * 钱包相关
 */

export const callGetGlobalWallet = ():Promise<any> => {
    return new Promise((resolve) => {
        resolve(GlobalWallet);
    });
};

/**
 * 获取dataCenter
 */
export const callGetDataCenter = ():Promise<any> => {
    return new Promise((resolve) => {
        resolve(dataCenter);
    });
};
/**
 * 验证当前账户身份
 * @param passwd 密码
 */
export const callVerifyIdentidy = (passwd:string):Promise<any> => {
    return new Promise((resolve) => {
        VerifyIdentidy(passwd).then(hash => {
            resolve(hash);
        });
    });
};

/**
 * 验证某个账户身份
 */
export const callVerifyIdentidy1 = (passwd:string,vault:string,salt:string) => {
    return new Promise((resolve) => {
        VerifyIdentidy1(passwd,vault,salt).then(hash => {
            resolve(hash);
        });
    });
};

/**
 * hash计算
 */
export const callCalcHashValue = (pwd, salt?) => {
    return calcHashValue(pwd,salt);
};

/**
 * 随机创建钱包
 */
export const callCreateWalletRandom = (option: CreateWalletOption,tourist?:boolean):Promise<any> => {
    return createWalletRandom(option,tourist);
};

/**
 * 通过助记词导入钱包
 */
export const callImportWalletByMnemonic = (option: CreateWalletOption):Promise<any> => {
    return importWalletByMnemonic(option);
};

/**
 * 图片创建钱包
 */
export const callCreateWalletByImage = (option: CreateWalletOption):Promise<any> => {
    return createWalletByImage(option);
};

/**
 * 冗余助记词导入
 */
export const callImportWalletByFragment = (option: CreateWalletOption):Promise<any> => {
    return importWalletByFragment(option);
};

/**
 * 创建新地址
 */
export const callCreateNewAddr = (passwd: string, currencyName: string) => {
    return new Promise((resolve,reject) => {
        createNewAddr(passwd,currencyName).then(successed => {
            if (successed) {
                resolve();
            } else {
                reject();
            }
        });
    });
};

/**
 * 备份助记词
 * @param passwd 密码 
 */
export const callBackupMnemonic = (passwd:string):Promise<any> => {
    return new Promise((resolve,reject) => {
        backupMnemonic(passwd).then(res => {
            resolve(res);
        });
    });
};