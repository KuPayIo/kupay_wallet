import { LANGUAGE } from '../core/btc/wallet';
import { getEthApiBaseUrl } from '../core/config';
import { isValidMnemonic } from '../core/genmnemonic';
import { AddrInfo, CreateWalletOption, MinerFeeLevel, TxHistory, TxPayload } from '../publicLib/interface';
import { dcClearTxTimer, dcInitErc20GasLimit, dcRefreshAllTx, dcUpdateAddrInfo, dcUpdateBalance } from '../remote/dataCenter';
// tslint:disable-next-line:max-line-length
import { btcRecharge, btcWithdraw, doERC20TokenTransfer, doEthTransfer, ethRecharge, ethWithdraw, resendBtcRecharge, resendBtcTransfer, transfer } from '../remote/pullWallet';
import { getAddrsInfoByCurrencyName, getCurrentAddrInfo, updateLocalTx } from '../remote/tools';
// tslint:disable-next-line:max-line-length
import { ahashToArgon2Hash, backupMnemonic, createNewAddr, createWalletByImage, createWalletRandom, exportBTCPrivateKey, exportERC20TokenPrivateKey, exportETHPrivateKey, fetchGasPrice, fetchMinerFeeList, fetchTransactionList, getMnemonicByHash, getWltAddrIndex, importWalletByFragment, importWalletByMnemonic, lockScreenHash, lockScreenVerify, passwordChange, updateShowCurrencys, VerifyIdentidy, VerifyIdentidy1 } from '../remote/wallet';

/**
 * 获取eth api url
 */
export const callGetEthApiBaseUrl = () => {
    return new Promise((resolve) => {
        resolve(getEthApiBaseUrl());
    });
};

/**
 * dataCenter更新余额
 */
export const callDcUpdateBalance = (addr: string, currencyName: string) => {
    return new Promise((resolve) => {
        dcUpdateBalance(addr, currencyName);
        resolve();
    });
};

/**
 * dataCenter刷新本地钱包
 */
export const callDcRefreshAllTx = () => {
    return new Promise((resolve) => {
        dcRefreshAllTx();
        resolve();
    });
};

/**
 * dataCenter初始化ERC20代币GasLimit
 */
export const callDcInitErc20GasLimit = () => {
    return new Promise((resolve) => {
        dcInitErc20GasLimit();
        resolve();
    });
};

/**
 * dataCenter更新地址相关 交易记录及余额定时更新
 */
export const callDcUpdateAddrInfo = (addr: string, currencyName: string) => {
    return new Promise((resolve) => {
        dcUpdateAddrInfo(addr,currencyName);
        resolve();
    });
};

/**
 * dataCenter通过hash清楚定时器
 */
export const callDcClearTxTimer = (hash: string) => {
    return new Promise((resolve) => {
        dcClearTxTimer(hash);
        resolve();
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
export const callVerifyIdentidy1 = (passwd:string,vault:string,salt:string):Promise<any> => {
    return new Promise((resolve) => {
        VerifyIdentidy1(passwd,vault,salt).then(hash => {
            resolve(hash);
        });
    });
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
export const callBackupMnemonic = (passwd:string,needFragments:boolean = true):Promise<any> => {
    return backupMnemonic(passwd,needFragments);
};

/**
 * 修改密码
 */
export const callPasswordChange = (secretHash: string, newPsw: string) => {
    return passwordChange(secretHash,newPsw);
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

/**
 * 普通转账
 */
export const callTransfer = (psw:string,txPayload:TxPayload) => {
    return transfer(psw,txPayload);
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

/**
 * 判断助记词是否合法
 */
export const callisValidMnemonic = (language: LANGUAGE, mnemonic: string) => {
    return new Promise(resolve => {
        resolve(isValidMnemonic(language, mnemonic));
    });
};

// 导出以太坊私钥
export const callExportETHPrivateKey = (mnemonic:string,addrs: AddrInfo[]):Promise<any> => {
    return new Promise(resolve => {
        resolve(exportETHPrivateKey(mnemonic, addrs));
    });
};

 // 导出BTC私钥
export const callExportBTCPrivateKey = (mnemonic:string,addrs: AddrInfo[]):Promise<any> => {
    return new Promise(resolve => {
        resolve(exportBTCPrivateKey(mnemonic, addrs));
    });
};

// 导出ERC20私钥
export const callExportERC20TokenPrivateKey = (mnemonic:string,addrs: AddrInfo[],currencyName:string):Promise<any> => {
    return new Promise(resolve => {
        resolve(exportERC20TokenPrivateKey(mnemonic, addrs,currencyName));
    });
};

/**
 * btc充值
 */
export const callBtcRecharge = (psw:string,txRecord:TxHistory) => {
    return btcRecharge(psw,txRecord);
};

/**
 * eth充值
 */
export const callEthRecharge = (psw:string,txRecord:TxHistory) => {
    return ethRecharge(psw,txRecord);
};

/**
 * btc重发充值
 */
export const callResendBtcRecharge = (psw:string,txRecord:TxHistory) => {
    return resendBtcRecharge(psw,txRecord);
};

// eth提现
export const callEthWithdraw = (secretHash:string,toAddr:string,amount:number | string) => {
    return ethWithdraw(secretHash,toAddr,amount);
};

// btc提现
export const callBtcWithdraw = (secretHash:string,toAddr:string,amount:number | string) => {
    return btcWithdraw(secretHash,toAddr,amount);
};

/**
 * 获取钱包地址的位置
 */
export const callGetWltAddrIndex = (addr: string, currencyName: string):Promise<any> => {
    return new Promise(resolve => {
        resolve(getWltAddrIndex(addr,currencyName));
    });
};

/**
 * 处理ETH转账
 */
export const callDoEthTransfer = (psw:string,addrIndex:number,txRecord:TxHistory) => {
    return doEthTransfer(psw,addrIndex,txRecord);
};

/**
 * btc重发
 */
export const callResendBtcTransfer = (psw:string,addrIndex:number,txRecord:TxHistory) => {
    return resendBtcTransfer(psw,addrIndex,txRecord);
};

/**
 * 处理eth代币转账
 */
export const callDoERC20TokenTransfer = (psw:string,addrIndex:number, txRecord:TxHistory) => {
    return doERC20TokenTransfer(psw,addrIndex,txRecord);
};

/**
 * ahash to argonhash
 * @param imagePsw 图片密码
 * @param ahash ahash
 */
export const callAhashToArgon2Hash = (ahash: string, imagePsw: string) => {
    return ahashToArgon2Hash(ahash,imagePsw);
};

// 锁屏密码hash算法
export const callLockScreenHash = (psw:string):Promise<any> => {
    return new Promise(resolve => {
        resolve(lockScreenHash(psw));
    });
};

// 锁屏密码验证
export const callLockScreenVerify = (psw:string) => {
    return new Promise(resolve => {
        resolve(lockScreenVerify(psw));
    });
};