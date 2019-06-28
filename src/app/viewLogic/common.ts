import { callGetCloudBalances, callGetCloudWallets, registerStore } from '../middleLayer/wrap';
import { addStoreLoadedListener } from '../postMessage/vmLoaded';
import { CloudCurrencyType, CloudWallet } from '../publicLib/interface';

/**
 * 注册store监听  在vm加载完成之后执行
 */
export const registerStoreData = (keyName: string, cb: Function) => {
    addStoreLoadedListener(() => {
        registerStore(keyName,cb);
    });
};

/**
 * 获取cloudWallets  
 */
export const getCloudWallets = () => {
    return callGetCloudWallets().then(cloudWallets => {
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