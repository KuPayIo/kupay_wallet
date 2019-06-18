
import { getStore as chatGetStore } from '../../chat/client/app/data/store';
import { uploadFileUrlPrefix } from '../publicLib/config';
import { CloudCurrencyType, TxHistory } from '../publicLib/interface';
// tslint:disable-next-line:max-line-length
import { currencyExchangeAvailable, deletLocalTx, fetchBalanceValueOfCoin, fetchCloudTotalAssets, fetchCloudWalletAssetList, fetchCoinGain, fetchLocalTotalAssets, fetchWalletAssetList, getScreenModify, setEthNonce } from '../remote/tools';
import { getStoreData } from './memBridge';

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
export const callGetUserInfo = () => {
    return getStoreData('user/info').then(userInfo => {
        const nickName = userInfo.nickName;
        const phoneNumber = userInfo.phoneNumber;
        const isRealUser = userInfo.isRealUser;
        const areaCode = userInfo.areaCode;
        const acc_id = userInfo.acc_id;
        let avatar = userInfo.avatar;
        if (avatar && avatar.indexOf('data:image') < 0) {
            avatar = `${uploadFileUrlPrefix}${avatar}`;
        } else {
            avatar = 'app/res/image/default_avater_big.png';
        }
        const level = chatGetStore(`userInfoMap/${chatGetStore('uid')}`,{ level:0 }).level;

        return {
            nickName,
            avatar,
            phoneNumber,
            areaCode,
            isRealUser,
            acc_id,
            level
        };
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