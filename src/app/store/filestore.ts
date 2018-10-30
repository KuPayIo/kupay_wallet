/**
 * 处理localStorage上的数据
 */
// ===================================================== 导入
import {
  BtcMinerFee,
  CloudCurrencyType,
  Currency2USDT,
  CurrencyRecord,
  GasPrice,
  Setting,
  UserInfo
} from './interface';
import { getStore, register } from './memstore';
// ===================================================== 导出

/**
 * 获取所有的账户列表
 */
export const getAllAccount = () => {
    const localAcccounts = getLocalStorage('accounts', {
        currenctId: '',
        accounts: []
    });

    return localAcccounts.accounts;
};

/**
 * 获取当前账户
 */
export const getCurrentAccount = () => {
    const localAcccounts = getLocalStorage('accounts', {
        currenctId: '',
        accounts: []
    });

    return localAcccounts.accounts[localAcccounts.currenctId];
};

/**

 * 获取3方数据
 */
export const getThird = () => {
    return getLocalStorage('third');
};

/**
 * 获取setting数据
 */
export const getSetting = () => {
    return getLocalStorage('setting',{
        language:'zh_Hans',
        changeColor:'redUp',
        currencyUnit:'CNY',
        lockScreen:{
            open:false,
            psw:''
        }
    });
};

/**
 * 注册文件数据库监听
 */
export const registerFileStore = () => {
    registerAccountChange(); // 监听账户变化
    registerThirdChange(); // 监听3方数据变化
    registerSettingChange(); // 监听setting数据变化
};

// ===================================================== 本地
const setLocalStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
};

const getLocalStorage = (key: string, defaultValue = undefined) => {
    return JSON.parse(localStorage.getItem(key)) || defaultValue;
};

// ===================================================== 立即执行

// =======================localStorage interface===============================

/**
 * 本地所有账户
 */
export interface Accounts {
    currenctId: string;  // 当前账户id
    accounts: {
    // 所有账户
        [key: string]: Account;
    };
}

/**
 * 本地账户数据
 */
export interface Account {
    user: LocalUser;
    wallet: LocalWallet;
    cloud: LocalCloud;
}

/**
 * 当前用户数据
 */
export interface LocalUser {
    id: string;            // 该账号的id (第一个ETH地址)
    token: string;         // 自动登录token
    publicKey: string;     // 用户公钥, 第一个以太坊地址的公钥
    salt: string;          // 加密 盐值
    info: UserInfo;        // 基本信息
}

/**
 * 当前用户前端数据
 */
export interface LocalCloud {
    cloudWallets: Map<CloudCurrencyType, LocalCloudWallet>;     // 云端钱包相关数据, 余额  充值提现记录...
}

/**
 * 云端钱包
 */
export interface LocalCloudWallet {
    balance: number;   // 余额
}

/**
 * 钱包对象
 */
export interface LocalWallet {
    vault: string;                      // 钱包核心
    isBackup: boolean;                  // 备份助记词与否
    showCurrencys: string[];            // 显示的货币列表
    currencyRecords: CurrencyRecord[];  // 支持的所有货币记录
}

/**
 * 本地3方数据
 */
export interface LocalThird {
    gasPrice: GasPrice; // gasPrice分档次
    btcMinerFee: BtcMinerFee; // btc minerfee 分档次
    gasLimitMap: Map<string, number>; // 各种货币转账需要的gasLimit

    rate: number; // 货币的美元汇率
    currency2USDTMap: Map<string, Currency2USDT>; // k线  --> 计算涨跌幅
}
// =======================================================

/**
 * 账户相关变化监听
 */
const registerAccountChange = () => {
    register('user', () => {
        accountChange();
    });
    register('user/token', () => {
        accountChange();
    });
    register('wallet', () => {
        accountChange();
    });
    register('wallet/currencyRecords', () => {
        accountChange();
    });
};

/**
 * 3方数据变化监听
 */
const registerThirdChange = () => {
    register('third/gasPrice', () => {
        thirdChange();
    });
    register('third/btcMinerFee', () => {
        thirdChange();
    });
    register('third/gasLimitMap', () => {
        thirdChange();
    });
    register('third/rate', () => {
        thirdChange();
    });
    register('third/currency2USDTMap', () => {
        thirdChange();
    });
};

/**
 * setting数据变化监听
 */
const registerSettingChange = () => {
    register('setting/language',() => {
        settingChange();
    });
    register('setting/changeColor',() => {
        settingChange();
    });
    register('setting/currencyUnit',() => {
        settingChange();
    });
    register('setting/lockScreen',() => {
        settingChange();
    });
};

/**
 * 当前账户变化
 */
const accountChange = () => {
    const storeUser = getStore('user');
    const localAccounts = getLocalStorage('accounts', {
        currenctId: '',
        accounts: {}
    });
    const localUser: LocalUser = {
        id: storeUser.id,
        token: storeUser.token,
        publicKey: storeUser.publicKey,
        salt: storeUser.salt,
        info: storeUser.info
    };

    const storeCloudWallets: Map<CloudCurrencyType, LocalCloudWallet> = getStore('cloud/cloudWallets');
    const localCloudWallets = new Map<CloudCurrencyType, LocalCloudWallet>();

    for (const [k, v] of storeCloudWallets) {
        const cloudWallet: LocalCloudWallet = { balance: v.balance };
        localCloudWallets.set(k, cloudWallet);
    }

    const newAccount: Account = {
        user: localUser,
        wallet: getStore('wallet'),
        cloud: { cloudWallets: localCloudWallets }
    };

    localAccounts.currenctId = storeUser.id;
    localAccounts.accounts[storeUser.id] = newAccount;

    setLocalStorage('accounts', localAccounts);
};

/**
 * 第3方数据变化
 */
const thirdChange = () => {
    const localThird: LocalThird = {
        gasPrice: getStore('third/gasPrice'),
        btcMinerFee: getStore('third/btcMinerFee'),
        gasLimitMap: getStore('third/gasLimitMap'),
        rate: getStore('third/rate'),
        currency2USDTMap: getStore('third/currency2USDTMap')
    };
    setLocalStorage('third', localThird);
};

/**
 * setting数据变化
 */
const settingChange = () => {
    const localSetting:Setting = {
        language:getStore('setting/language'),
        changeColor:getStore('setting/changeColor'),
        currencyUnit:getStore('setting/currencyUnit'),
        lockScreen:getStore('setting/lockScreen')
    };
    setLocalStorage('setting',localSetting);
};