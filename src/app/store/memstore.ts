/**
 * @file store
 * @author donghr
 */
// ============================================ 导入
import { appLanguageList, LocalLanguageMgr } from '../../pi/browser/localLanguage';
import { HandlerMap } from '../../pi/util/event';
import { setLang } from '../../pi/util/lang';
import { cryptoRandomInt } from '../../pi/util/math';
import { defaultSetting } from '../config';
import { topHeight } from '../utils/constants';
import { deleteFile, getFile, getLocalStorage, initFileStore, setLocalStorage, writeFile } from './filestore';
// tslint:disable-next-line:max-line-length
import { AddrInfo, BtcMinerFee, ChangellyPayinAddr, ChangellyTempTxs, CloudCurrencyType, CloudWallet, Currency2USDT, CurrencyRecord, GasPrice, Setting, Silver, Store, TxHistory, UserInfo, Wallet } from './interface';

// ============================================ 导出

/**
 * 初始化store
 */
export const initStore = () => {
    return new Promise(resolve => {
        registerFileStore();    // 注册监听
        initAccount();          // 账户初始化
        initSettings();         // 设置初始化
        initThird();            // 三方数据初始化
        initInviteUsers();      // 邀请好友数据初始化
        initFile().then(() => {
            resolve();
        });             // indexDb数据初始化
    });
    
};

/**
 * 判断是否是对象
 */
const isObject = (value: any) => {
    const vtype = typeof value;

    return value !== null && (vtype === 'object' || vtype === 'function');
};

/**
 * 数据深拷贝
 */
export const deepCopy = (v: any): any => {
    if (!v || v instanceof Promise || !isObject(v)) return v;
    if (v instanceof Map) {
        return new Map(JSON.parse(JSON.stringify(v)));
    }

    const newobj = v.constructor === Array ? [] : {};
    for (const i in v) {
        newobj[i] = isObject(v[i]) ? deepCopy(v[i]) : v[i];
    }

    return newobj;
};

/**
 * 根据路径获取数据
 */
export const getStore = (path: string, defaultValue = undefined) => {
    let ret = store;
    for (const key of path.split('/')) {
        if (key in ret) {
            ret = ret[key];
        } else {
            // 路径中有和store内部不同的键，肯定是bug
            // tslint:disable-next-line:prefer-template
            throw new Error('getStore Failed, path = ' + path);
        }
    }
    const deepRet = deepCopy(ret);

    return (typeof deepRet === 'boolean' || typeof deepRet === 'number') ? deepRet : (deepRet || defaultValue);
};

/**
 * 更新store并通知
 */
export const setStore = (path: string, data: any, notified = true) => {
    const keyArr = path.split('/');

    const notifyPath = [];
    for (let i = 0; i < keyArr.length; i++) {
        // tslint:disable-next-line:prefer-template
        const path = i === 0 ? keyArr[i] : notifyPath[i - 1] + '/' + keyArr[i];
        notifyPath.push(path);
    }
    // console.log(notifyPath);
    // 原有的最后一个键
    const lastKey = keyArr.pop();

    let parent = store;
    for (const key of keyArr) {
        if (key in parent) {
            parent = parent[key];
        } else {
            // 路径中有和store内部不同的键，肯定是bug
            // tslint:disable-next-line:prefer-template
            throw new Error('setStore Failed, path = ' + path);
        }
    }
    parent[lastKey] = deepCopy(data);

    if (notified) {
        for (let i = notifyPath.length - 1; i >= 0; i--) {
            handlerMap.notify(notifyPath[i], getStore(notifyPath[i]));
        }
    }
};

/**
 * 注册消息处理器
 */
export const register = (keyName: string, cb: Function): void => {
    handlerMap.add(keyName, <any>cb);
};

/**
 * 取消注册消息处理器
 */
export const unregister = (keyName: string, cb: Function): void => {
    handlerMap.remove(keyName, <any>cb);
};

/**
 * 获取云端余额
 */
export const getCloudBalances = () => {
    const cloudWallets = store.cloud.cloudWallets;
    const cloudBalances = new Map<CloudCurrencyType | String, number>();
    for (const [key, val] of cloudWallets) {
        cloudBalances.set(key, val.balance || 0);
    }

    return cloudBalances;
};

/**
 * 初始化cloudWallets
 */
export const initCloudWallets = () => {
    const cloudWallets = new Map<CloudCurrencyType, CloudWallet>();
    for (const key in CloudCurrencyType) {
        const isValueProperty = parseInt(key, 10) >= 0;
        if (isValueProperty) {
            const cloudWallet = {
                balance: 0,
                rechargeLogs: { list: [], start: 0, canLoadMore: false },
                withdrawLogs: { list: [], start: 0, canLoadMore: false },
                otherLogs: { list: [], start: 0, canLoadMore: false }
            };
            cloudWallets.set(CloudCurrencyType[CloudCurrencyType[key]], cloudWallet);
        }
    }
    
    return cloudWallets;
};

/**
 * 获取所有的账户列表
 */
export const getAllAccount = () => {
    const localAcccounts = getLocalStorage('accounts', {
        currenctId: '',
        accounts: {}
    });
    const accounts = [];
    for (const key in localAcccounts.accounts) {
        accounts.push(localAcccounts.accounts[key]);
    }

    return accounts;
};

/**
 * 删除账户
 */
export const deleteAccount = (id: string) => {
    const localAcccounts = getLocalStorage('accounts', {
        currenctId: '',
        accounts: {}
    });
    deleteFile(id);
    delete localAcccounts.accounts[id];
    setLocalStorage('accounts', localAcccounts);
};

// ===================================================本地
/**
 * indexDB数据初始化
 */
const initFile = () => {
    return new Promise(resolve => {
        initFileStore().then(() => {
            const txHistoryPromise = initTxHistory();         // 历史记录初始化
            // const activityPromise = initActivity();         // 活动初始化
            Promise.all([txHistoryPromise]).then(() => {
                resolve();
            });
            
        });
    });
    
};

/**
 * 初始化历史记录
 * @param fileTxHistorys indexDb存储的历史记录
 */
const initTxHistory = () => {
    return new Promise(resolve => {
        if (!store.user.id) {
            resolve();
            
            return;
        }
        getFile(store.user.id, (value, key) => {
            if (value) {
                const currencyRecords = store.wallet.currencyRecords;
                for (const record of currencyRecords) {
                    for (const addrInfo of record.addrs) {
                        addrInfo.txHistory = getTxHistory(value, record.currencyName, addrInfo.addr);
                    }
                }
            }
            resolve();
        }, () => {
            resolve();
            console.log('read error');
        });
    });
    
};

/**
 * 获取历史记录
 */
const getTxHistory = (fileTxHistorys: FileTxHistory[], currencyName: string, addr: string) => {
    for (const fileTxHistory of fileTxHistorys) {
        if (fileTxHistory.currencyName === currencyName && fileTxHistory.addr === addr) {
            return fileTxHistory.txHistory;
        }
    }
};

/**
 * 账户初始化
 */
const initAccount = () => {
    const localAcccounts = getLocalStorage('accounts', {
        currenctId: '',
        accounts: {}
    });
    const curAccount = localAcccounts.accounts[localAcccounts.currenctId];
    if (curAccount) {
        const fileUser = curAccount.user;

        // store.user init
        store.user.id = fileUser.id;
        store.user.token = fileUser.token;
        store.user.publicKey = fileUser.publicKey;
        store.user.salt = fileUser.salt;
        store.user.info = {
            ...fileUser.info
        };

        // store.cloud init
        const localCloudWallets = new Map<CloudCurrencyType, LocalCloudWallet>(curAccount.cloud.cloudWallets);
        for (const [key, value] of localCloudWallets) {
            const cloudWallet = store.cloud.cloudWallets.get(key);
            cloudWallet.balance = localCloudWallets.get(key).balance;

        }

        // store.wallet init
        const localWallet = curAccount.wallet;
        const currencyRecords = [];
        for (const localRecord of localWallet.currencyRecords) {
            const addrs = [];
            for (const info of localRecord.addrs) {
                const addrInfo: AddrInfo = {
                    addr: info.addr,
                    balance: info.balance,
                    txHistory: []
                };
                addrs.push(addrInfo);
            }
            const record: CurrencyRecord = {
                currencyName: localRecord.currencyName,
                currentAddr: localRecord.currentAddr,
                addrs,
                updateAddr: localRecord.updateAddr
            };
            currencyRecords.push(record);
        }
        
        const wallet: Wallet = {
            vault: localWallet.vault,
            setPsw:localWallet.setPsw,
            backupTip:localWallet.backupTip,
            isBackup: localWallet.isBackup,
            sharePart:false,
            helpWord:false,
            showCurrencys: localWallet.showCurrencys,
            currencyRecords,
            changellyPayinAddress:localWallet.changellyPayinAddress || [],
            changellyTempTxs:localWallet.changellyTempTxs || []
        };
        store.wallet = wallet;
    } else {
        store.user.salt = cryptoRandomInt().toString();
    }
};

/**
 * 设置初始
 */
const initSettings = () => {

    let langNum;
    const appLanguage = new LocalLanguageMgr();
    appLanguage.init();
    appLanguage.getSysLan({
        success: (localLan) => {
            // tslint:disable-next-line:radix
            langNum = parseInt(localLan);
            const localSet = getLocalStorage('setting');
            if (!localSet) {
                if (langNum === appLanguageList.zh_Hans || langNum === appLanguageList.zh_Hant) {
                    setLang(appLanguageList[langNum]);
                    store.setting.language = appLanguageList[langNum];
                } else {
                    setLang(defaultSetting.DEFAULT_LANGUAGE);
                    store.setting.language = defaultSetting.DEFAULT_LANGUAGE;
                }
            }

        },
        fail: (result) => {
            console.log(result);
        }
    });
    const setting = getLocalStorage('setting', {
        language: defaultSetting.DEFAULT_LANGUAGE,
        changeColor: defaultSetting.DEFAULT_CHANGECOLOR,
        currencyUnit: defaultSetting.DEFAULT_CURRENCY,
        lockScreen: {
            open: false,
            psw: ''
        },
        deviceId: '',
        topHeight,
        bottomHeight:0
    });
    store.setting = {
        ...store.setting,
        ...setting
    };
    setLang(setting.language);

};

/**
 * 三方数据初始
 */
const initThird = () => {
    const third = getLocalStorage('third');
    if (!third) return;
    store.third.gasPrice = third.gasPrice;
    store.third.btcMinerFee = third.btcMinerFee;
    store.third.rate = third.rate;
    store.third.silver = third.silver;
    store.third.gasLimitMap = new Map<string, number>(third.gasLimitMap);
    store.third.currency2USDTMap = new Map<string, Currency2USDT>(third.currency2USDTMap);
};

/**
 * 注册文件数据库监听
 */
const registerFileStore = () => {
    registerAccountChange(); // 监听账户变化
    registerThirdChange(); // 监听3方数据变化
    registerSettingChange(); // 监听setting数据变化
};

/**
 * 账户相关变化监听
 */
const registerAccountChange = () => {
    register('user', () => {
        accountChange();
    });
    register('wallet', () => {
        accountChange();
    });
    register('cloud', () => {
        accountChange();
    });
};

/**
 * 3方数据变化监听
 */
const registerThirdChange = () => {
    register('third', () => {
        thirdChange();
    });
};

/**
 * setting数据变化监听
 */
const registerSettingChange = () => {
    register('setting', () => {
        settingChange();
    });
    register('inviteUsers/invite_success', () => {
        inviteUsersChange();
    });
    register('inviteUsers/convert_invite', () => {
        inviteUsersChange();
    });
};

/**
 * 邀请好友数据变化
 */
const inviteUsersChange = () => {
    const localInvite = {
        invite_success: getStore('inviteUsers').invite_success,  // 我邀请的好友
        convert_invite: getStore('inviteUsers').convert_invite  // 邀请我的好友
    };
    setLocalStorage('inviteUsers', localInvite);
};

/**
 * 邀请好友数据初始
 */
const initInviteUsers = () => {
    const data = getLocalStorage('inviteUsers');
    if (!data) return;
    console.log('===========================邀请好友数据初始',data);
    setStore('inviteUsers/invite_success',data.invite_success);
    setStore('inviteUsers/convert_invite',data.convert_invite);
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

    if (!storeUser.id) {
        const flags = getStore('flags');
        const saveAccount = flags.saveAccount;
        if (saveAccount) {
            localAccounts.currenctId = '';
            setLocalStorage('accounts', localAccounts);
        } else {
            deleteFile(localAccounts.currenctId);
            delete localAccounts.accounts[localAccounts.currenctId];
            localAccounts.currenctId = '';
            setLocalStorage('accounts', localAccounts);

        }

        return;
    }
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

    const wallet = getStore('wallet');
    const fileTxHistorys = [];
    let localWallet: LocalWallet = null;
    if (wallet) {
        const localCurrencyRecords = wallet.currencyRecords.map(record => {
            const addrs = record.addrs.map(info => {
                const fileTxHistory: FileTxHistory = {
                    currencyName: record.currencyName,
                    addr: info.addr,
                    txHistory: info.txHistory
                };
                fileTxHistorys.push(fileTxHistory);

                return {
                    addr: info.addr,
                    balance: info.balance
                };
            });

            return {
                ...record,
                addrs
            };
        });

        localWallet = {
            vault: wallet.vault,
            setPsw:wallet.setPsw,
            backupTip:wallet.backupTip,
            isBackup: wallet.isBackup,
            showCurrencys: wallet.showCurrencys,
            currencyRecords: localCurrencyRecords,
            changellyPayinAddress:wallet.changellyPayinAddress,
            changellyTempTxs:wallet.changellyTempTxs
        };
    }

    const newAccount: Account = {
        user: localUser,
        wallet: localWallet,
        cloud: { cloudWallets: localCloudWallets }
    };

    localAccounts.currenctId = storeUser.id;
    localAccounts.accounts[storeUser.id] = newAccount;

    setLocalStorage('accounts', localAccounts);
    writeFile(storeUser.id, fileTxHistorys);

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
        silver: getStore('third/silver'),
        currency2USDTMap: getStore('third/currency2USDTMap')
    };
    setLocalStorage('third', localThird);
};

/**
 * setting数据变化
 */
const settingChange = () => {
    const localSetting: Setting = {
        language: getStore('setting/language'),
        changeColor: getStore('setting/changeColor'),
        currencyUnit: getStore('setting/currencyUnit'),
        lockScreen: getStore('setting/lockScreen'),
        deviceId: getStore('setting/deviceId'),
        deviceInfo:getStore('setting/deviceInfo'),
        topHeight: getStore('setting/topHeight'),
        bottomHeight:getStore('setting/bottomHeight')
    };
    setLocalStorage('setting', localSetting);
};

// ======================================================== 本地

// ============================================ 立即执行

/**
 * 消息处理列表
 */
const handlerMap: HandlerMap = new HandlerMap();

// 全局内存数据库
const store: Store = {
    user: {
        id: '',                      // 该账号的id
        offline: false,               // 连接状态
        isLogin: true,              // 登录状态
        allIsLogin:false,            // 所有服务登录状态  (钱包  活动  聊天)
        token: '',                   // 自动登录token
        conRandom: '',               // 连接随机数
        conUid: '',                   // 服务器连接uid
        publicKey: '',               // 用户公钥, 第一个以太坊地址的公钥
        salt: '',                    // 加密 盐值
        info: {                      // 用户基本信息
            nickName: '',           // 昵称
            avatar: '',             // 头像
            phoneNumber: '',        // 手机号
            areaCode:'86',          // 区域码
            isRealUser: false,       // 是否是真实用户
            acc_id:''                // 好嗨号
        }
    },
    wallet: null,
    cloud: {
        cloudWallets: initCloudWallets()     // 云端钱包相关数据, 余额  充值提现记录...
    },
    activity: {
        luckyMoney: {
            sends: null,          // 发送红包记录
            exchange: null,       // 兑换红包记录
            invite: null          // 邀请码记录
        },
        mining: {
            total: null,      // 挖矿汇总信息
            history: null, // 挖矿历史记录
            addMine: [],  // 矿山增加项目
            mineRank: null,    // 矿山排名
            miningRank: null,  // 挖矿排名
            itemJump: null
        },                       // 挖矿
        dividend: {
            total: null,         // 分红汇总信息
            history: null       // 分红历史记录
        },
        financialManagement: {          // 理财
            products: null,
            purchaseHistories: null
        }
    },
    setting: {
        lockScreen: {         // 锁屏
            psw: '',
            open: false,
            locked: false
        },
        language: '',             // 语言
        changeColor: '',          // 涨跌颜色设置，默认：红跌绿张
        currencyUnit: '',         // 显示哪个国家的货币
        deviceId: '',             // 设备唯一ID
        deviceInfo:null,           // 设备信息
        topHeight,              // 设备头部应空出来的高度
        bottomHeight:0            // 设备底部应空出来的高度
    },
    third: {
        gasPrice: null,                             // gasPrice分档次
        btcMinerFee: null,                          // btc minerfee 分档次
        gasLimitMap: new Map<string, number>(),     // 各种货币转账需要的gasLimit

        // changelly
        changellyCurrencies: [],                                  // changelly 支持的币种
        rate: 0,                                            // 货币的美元汇率
        silver: {                                         // 黄金价格
            price: 0,
            change: 0
        },
        currency2USDTMap: new Map<string, Currency2USDT>()  // k线  --> 计算涨跌幅
    },
    flags: {},
    inviteUsers:{}
};

initStore();

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

export interface LocalCurrencyRecord {
    currencyName: string;            // 货币名称
    currentAddr: string;             // 当前正在使用的地址
    addrs: LocalAddrInfo[];          // 所有的地址
    updateAddr: boolean;             // 地址是否已经更新
}

/**
 * 地址对象
 */
export interface LocalAddrInfo {
    addr: string;                    // 地址
    balance: number;                 // 余额
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
    setPsw:boolean;                     // 是否已经设置密码
    backupTip:boolean;                  // 助记词备份是否已经提示
    isBackup: boolean;                  // 备份助记词与否
    showCurrencys: string[];            // 显示的货币列表
    currencyRecords: LocalCurrencyRecord[];  // 支持的所有货币记录
    changellyPayinAddress:ChangellyPayinAddr[]; // changelly payinAddress
    changellyTempTxs:ChangellyTempTxs[]; // changelly临时交易记录
}

/**
 * 本地3方数据
 */
export interface LocalThird {
    gasPrice: GasPrice; // gasPrice分档次
    btcMinerFee: BtcMinerFee; // btc minerfee 分档次
    gasLimitMap: Map<string, number>; // 各种货币转账需要的gasLimit
    rate: number; // 货币的美元汇率
    silver: Silver; // 白银价格
    currency2USDTMap: Map<string, Currency2USDT>; // k线  --> 计算涨跌幅
}

/**
 * indexDB历史记录
 */
export interface FileTxHistory {
    currencyName: string;
    addr: string;
    txHistory: TxHistory[];
}
// =======================================================
