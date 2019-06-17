
import { CloudCurrencyType, TxHistory } from '../publicLib/interface';
// tslint:disable-next-line:max-line-length
import { currencyExchangeAvailable, deletLocalTx, fetchBalanceValueOfCoin, fetchCloudTotalAssets, fetchCloudWalletAssetList, fetchLocalTotalAssets, fetchWalletAssetList, getAddrInfoByAddr, getCurrencyUnitSymbol, getDeviceAllDetail, getScreenModify, getUserInfo, setEthNonce } from '../remote/tools';

/**
 * tools 对应的bridge
 */

/**
 * 删除本地交易记录
 */
export const callDeletLocalTx = (tx: TxHistory) => {
    return new Promise(resolve => {
        deletLocalTx(tx);
        resolve();
    });
};

/**
 * 设置某个地址的nonce
 * 只设置ETH地址下的nonce
 */
export const callSetEthNonce = (newNonce: number, addr: string) => {
    return new Promise(resolve => {
        setEthNonce(newNonce,addr);
        resolve();
    });
};

/**
 * 获取云端总资产
 */
export const callFetchCloudTotalAssets = ():Promise<any> => {
    return new Promise(resolve => {
        resolve(fetchCloudTotalAssets());
    });
};

/**
 * 获取总资产
 */
export const callFetchLocalTotalAssets = ():Promise<any> => {
    return new Promise(resolve => {
        resolve(fetchLocalTotalAssets());
    });
};
/**
 * 获取本地钱包资产列表
 */
export const callFetchWalletAssetList = () => {
    return new Promise(resolve => {
        resolve(fetchWalletAssetList());
    });
};

/**
 * 获取云端钱包资产列表
 */
export const callFetchCloudWalletAssetList = () => {
    return new Promise(resolve => {
        resolve(fetchCloudWalletAssetList());
    });
};

/**
 * 获取用户基本信息
 */
export const callGetUserInfo = (level:number = 0):Promise<any> => {
    // TODO 需要传入用户等级level
    return new Promise(resolve => {
        resolve(getUserInfo(level));
    });
};

/**
 * 获取货币单位符号 $ ￥
 */
export const callGetCurrencyUnitSymbol = () => {
    return new Promise(resolve => {
        resolve(getCurrencyUnitSymbol());
    });
};

/**
 * 通过地址获取地址余额
 */
export const callGetAddrInfoByAddr = (addr: string, currencyName: string):Promise<any> => {
    return new Promise(resolve => {
        resolve(getAddrInfoByAddr(addr,currencyName));
    });
};

/**
 * 获取屏幕刘海与下部分高度
 */
export const callGetScreenModify = () => {
    return new Promise(resolve => {
        getScreenModify();
        resolve();
    });
};

// 计算支持的币币兑换的币种
export const callcurrencyExchangeAvailable = ():Promise<any> => {
    return new Promise(resolve => {
        resolve(currencyExchangeAvailable());
    });
};

/**
 * 获取某个币种对应的货币价值
 */
export const callFetchBalanceValueOfCoin = (currencyName: string | CloudCurrencyType, balance: number):Promise<any> => {
    return new Promise(resolve => {
        resolve(fetchBalanceValueOfCoin(currencyName,balance));
    });
};