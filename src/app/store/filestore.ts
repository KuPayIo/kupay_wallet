/**
 * 处理localStorage上的数据
 */
// ===================================================== 导入
import { UserInfo, CurrencyRecord, CloudCurrencyType } from './interface';
import { register, getStore } from './memstore';
// ===================================================== 导出

/**
 * 注册文件数据库监听
 */
export const registerFileStore = () => {
    register('user', () => {
        accountChange();
    });
    register('user/id', () => {
        accountChange();
    });

    register('user/token', () => {
        accountChange();
    });

};


// ===================================================== 本地
const setLocalStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
};

const getLocalStorage = (key: string, defaultValue: any) => {
    return JSON.parse(localStorage.getItem(key)) || defaultValue;
};


// ===================================================== 立即执行


//=======================localStorage interface===============================

/**
 * 本地所有账户
 */
export interface Accounts {
    currenctId: string;  // 当前账户id
    accounts: {   // 所有账户
        [key: string]: Account
    }
}

export interface Account {
    user: LocalUser,
    wallet: LocalWallet,
    cloud: LocalCloud
}

/**
 * 当前用户数据
 */
export interface LocalUser {
    id: string,            // 该账号的id (第一个ETH地址)
    token: string,         // 自动登录token
    publicKey: string,     // 用户公钥, 第一个以太坊地址的公钥
    salt: string,          // 加密 盐值
    info: UserInfo,        // 基本信息
}

/**
 * 当前用户前端数据
 */
export interface LocalCloud {
    cloudWallets: Map<CloudCurrencyType, LocalCloudWallet>,     // 云端钱包相关数据, 余额  充值提现记录...
}

/**
 * 云端钱包
 */
export interface LocalCloudWallet {
    balance: number,   // 余额
}


/**
 * 钱包对象
 */
export interface LocalWallet {
    vault: string,                      // 钱包核心
    isBackup: boolean,                  // 备份助记词与否
    showCurrencys: string[],            // 显示的货币列表
    currencyRecords: CurrencyRecord[],  // 支持的所有货币记录
}


//=======================================================

/**
 * 当前账户变化
 */
const accountChange = () => {
    const storeUser = getStore('user');
    const localAccounts = getLocalStorage('accounts', { currenctId: '', accounts: {} });
    const localUser: LocalUser = {
        id: storeUser.id,
        token: storeUser.token,
        publicKey: storeUser.publicKey,
        salt: storeUser.salt,
        info: storeUser.info
    }

    const storeCloudWallets: Map<CloudCurrencyType, LocalCloudWallet> = getStore('cloud/cloudWallets');
    const localCloudWallets = new Map<CloudCurrencyType, LocalCloudWallet>();

    for (let [k, v] of storeCloudWallets) {
        const cloudWallet: LocalCloudWallet = { balance: v.balance };
        localCloudWallets.set(k, cloudWallet);
    }

    const newAccount: Account = {
        user: localUser,
        wallet: getStore('wallet'),
        cloud: { cloudWallets: localCloudWallets }
    }

    localAccounts.currenctId = storeUser.id;
    localAccounts.accounts[storeUser.id] = newAccount;

    setLocalStorage('accounts', localAccounts);
}


// 语言设置
register('languageSet', (language) => {
    setLocalStorage('languageSet', language);
});

// 涨跌颜色设置
register('changeColor', (changeColor) => {
    setLocalStorage('changeColor', changeColor);
});

// 涨跌颜色设置
register('currencyUnit', (currencyUnit) => {
    setLocalStorage('currencyUnit', currencyUnit);
});


