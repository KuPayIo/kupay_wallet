import { GlobalWallet } from '../core/globalWallet';
import { CreateWalletOption, MinerFeeLevel, TxHistory } from '../publicLib/interface';
import { dataCenter } from '../remote/dataCenter';
import { resendNormalTransfer, transfer } from '../remote/pullWallet';
import { getAddrsInfoByCurrencyName, getCurrentAddrInfo, updateLocalTx } from '../remote/tools';
// tslint:disable-next-line:max-line-length
import { backupMnemonic, calcHashValue, createNewAddr, createWalletByImage, createWalletRandom, fetchGasPrice, fetchLocalTxByHash1, fetchMinerFeeList, fetchTransactionList, getMnemonic, getMnemonicByHash, importWalletByFragment, importWalletByMnemonic, passwordChange, updateShowCurrencys, VerifyIdentidy, VerifyIdentidy1 } from '../remote/wallet';

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

/**
 * 增加或者删除展示的币种
 */
export const callUpdateShowCurrencys = (currencyName:string,added:boolean) => {
    return new Promise(resolve => {
        updateShowCurrencys(currencyName,added);
        resolve();
    });
};

/**
 * 获取当前钱包对应货币正在使用的地址信息
 * @param currencyName 货币类型
 */
export const callGetCurrentAddrInfo = (currencyName: string):Promise<any> => {
    return new Promise(resolve => {
        resolve(getCurrentAddrInfo(currencyName));
    });
};

/**
 * 获取钱包下指定货币类型的所有地址信息
 * @param wallet wallet obj
 */
export const callGetAddrsInfoByCurrencyName = (currencyName: string):Promise<any> => {
    return new Promise(resolve => {
        resolve(getAddrsInfoByCurrencyName(currencyName));
    });
};

export interface TxPayload {
    fromAddr:string;        // 转出地址
    toAddr:string;          // 转入地址
    pay:number;             // 转账金额
    currencyName:string;    // 转账货币
    fee:number;             // 矿工费
    minerFeeLevel:MinerFeeLevel;   // 矿工费等级
}

/**
 * 普通转账
 */
export const callTransfer = (psw:string,txPayload:TxPayload) => {
    return transfer(psw,txPayload);
};

/**
 * 普通转账重发
 */
export const callResendNormalTransfer = (psw:string,txRecord:TxHistory) => {
    return resendNormalTransfer(psw,txRecord);
};

/**
 * 更新本地交易记录
 */
export const callUpdateLocalTx = (tx: TxHistory) => {
    return new Promise(resolve => {
        updateLocalTx(tx);
        resolve();
    });
};