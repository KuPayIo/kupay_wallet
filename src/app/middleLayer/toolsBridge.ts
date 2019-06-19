
import { CloudCurrencyType, TxHistory } from '../publicLib/interface';
// tslint:disable-next-line:max-line-length
import { currencyExchangeAvailable, deletLocalTx, fetchBalanceValueOfCoin, fetchCloudTotalAssets, fetchCloudWalletAssetList, fetchCoinGain, fetchLocalTotalAssets, fetchWalletAssetList } from '../remote/tools';

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

// 计算支持的币币兑换的币种
export const callCurrencyExchangeAvailable = ():Promise<any> => {
    return new Promise(resolve => {
        resolve(currencyExchangeAvailable());
    });
};

/**
 * 获取某个币种对应的货币价值即汇率
 */
export const callFetchBalanceValueOfCoin = (currencyName: string | CloudCurrencyType, balance: number):Promise<any> => {
    return new Promise(resolve => {
        resolve(fetchBalanceValueOfCoin(currencyName,balance));
    });
};

// 获取货币的涨跌情况
export const callFetchCoinGain = (currencyName: string) => {
    return new Promise(resolve => {
        resolve(fetchCoinGain(currencyName));
    });
};