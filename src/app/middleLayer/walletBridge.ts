import { GlobalWallet } from '../core/globalWallet';
import { dataCenter } from '../jsc/jscDataCenter';
// tslint:disable-next-line:max-line-length
import { backupMnemonic, calcHashValue, createNewAddr, createWalletByImage, createWalletRandom, fetchGasPrice, fetchLocalTxByHash1, fetchMinerFeeList, fetchTransactionList, getMnemonic, getMnemonicByHash, importWalletByFragment, importWalletByMnemonic, passwordChange, VerifyIdentidy, VerifyIdentidy1 } from '../jsc/jscWallet';
import { CreateWalletOption, MinerFeeLevel } from '../store/interface';

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

/**
 * 获取助记词
 */
export const callGetMnemonic = (passwd:string) => {
    return getMnemonic(passwd);
};

/**
 * 修改密码
 */
export const callPasswordChange = (secretHash: string, newPsw: string) => {
    return passwordChange(secretHash,newPsw);
};

/**
 * 根据交易hash获取所有地址上本地交易详情
 */
export const callFetchLocalTxByHash1 = (hash:string):Promise<any> => {
    return new Promise(resolve => {
        resolve(fetchLocalTxByHash1(hash));
    });
};

/**
 * 获取矿工费
 */
export const callFetchMinerFeeList = (currencyName:string) => {
    return new Promise(resolve => {
        resolve(fetchMinerFeeList(currencyName));
    });
};

// 获取gasPrice
export const callFetchGasPrice = (minerFeeLevel: MinerFeeLevel):Promise<any> => {
    return new Promise(resolve => {
        resolve(fetchGasPrice(minerFeeLevel));
    });
};

/**
 * 获取某个地址的交易记录
 */
export const callFetchTransactionList = (addr:string,currencyName:string):Promise<any> => {
    return new Promise(resolve => {
        resolve(fetchTransactionList(addr,currencyName));
    });
};

// 根据hash获取助记词
export const callGetMnemonicByHash = (hash:string):Promise<any> => {
    return new Promise(resolve => {
        resolve(getMnemonicByHash(hash));
    });
};