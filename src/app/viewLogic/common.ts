import { callGetCloudBalances, getStoreData, registerStore } from '../middleLayer/wrap';
import { CloudCurrencyType, CloudWallet } from '../publicLib/interface';
import { addVmLoadedListener } from './vmLoaded';

/**
 * 注册store监听  在vm加载完成之后执行
 */
export const registerStoreData = (keyName: string, cb: Function) => {
    addVmLoadedListener(() => {
        registerStore(keyName,cb);
    });
};

/**
 * 获取cloudWallets  
 */
export const getCloudWallets = () => {
    return getStoreData('cloud/cloudWallets').then(cloudWallets => {
        return new Map<CloudCurrencyType, CloudWallet>(cloudWallets);
    });
};

/**
 * 获取云端余额
 */
export const getCloudBalances = () => {
    return callGetCloudBalances().then(cloudBalances => {
        return new Map<CloudCurrencyType | String, number>(cloudBalances);
    });
};