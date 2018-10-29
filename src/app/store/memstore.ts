/**
 * @file store
 * @author donghr
 */
// ============================================ 导入
import { HandlerMap } from '../../pi/util/event';
import { cryptoRandomInt } from '../../pi/util/math';
import { getCurrentAccount } from './filestore';
import { CloudCurrencyType, CloudWallet, Currency2USDT, ShapeShiftTxs, Store } from './interface';

// ============================================ 导出
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

    return ret || defaultValue;
};

/**
 * 更新store并通知
 */
export const setStore = (path: string, data: any, notified = true) => {
    const keyArr = path.split('/');
    
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

    parent[lastKey] = data;

    if (notified) {
        handlerMap.notify(path, [data]);
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
    const cloudBalances = new Map<CloudCurrencyType,number>();
    for (const [key,val] of cloudWallets) {
        cloudBalances.set(key,val.balance || 0);
    }

    return cloudBalances;
};
/**
 * 初始化store
 */
export const initStore = () => {

    initUser();

    // initSettings(null);

    // initThird(null);

};

// type loadingEventName = 'level_1_page_loaded' | 'level_2_page_loaded' ;

// ============================================ 本地

// ============================================ 立即执行

/**
 * 消息处理列表
 */
const handlerMap: HandlerMap = new HandlerMap();

const initUser = () => {
    const curAccount = getCurrentAccount();
    if (!curAccount) {
        store.user.salt = cryptoRandomInt().toString();
        
        return;
    }
    const fileUser = curAccount.user;
    store.user.id = fileUser.id;
    store.user.token = fileUser.token;
    store.user.publicKey = fileUser.publicKey;
    store.user.salt = fileUser.salt;
    store.user.info = {
        ...fileUser.info
    };

    store.wallet = {
        ...curAccount.wallet
    };
};

const initSettings = (setting) => {
    store.setting = {
        ...setting
    };
};

const initThird = (third) => {
    store.third.gasLimitMap = new Map<string, number>(third && third.gasLimitMap);
    store.third.shapeShiftTxsMap = new Map<string, ShapeShiftTxs>(third && third.shapeShiftTxsMap);
    store.third.currency2USDTMap = new Map<string, Currency2USDT>(third && third.currency2USDTMap);
};

// 全局内存数据库
const store: Store = {
    user: {
        id: '',                      // 该账号的id
        isLogin: false,              // 登录状态
        token: '',                   // 自动登录token
        conRandom: '',               // 连接随机数
        conUid:'',                   // 服务器连接uid
        publicKey: '',               // 用户公钥, 第一个以太坊地址的公钥
        salt: '',                    // 加密 盐值
        secretHash: '',             // 密码hash缓存   
        info: {                      // 用户基本信息
            nickName: '',      // 昵称
            avatar: '',        // 头像
            phoneNumber: '',   // 手机号
            isRealUser: false    // 是否是真实用户
        }
    },
    wallet: null,
    cloud: {
        cloudWallets: new Map<CloudCurrencyType, CloudWallet>()     // 云端钱包相关数据, 余额  充值提现记录...
    },
    activity: {
        luckyMoney: null,                   // 红包
        mining: null,                       // 挖矿
        dividend: null,                     // 分红
        financialManagement: null          // 理财
    },
    setting: {
        lockScreen: null,         // 锁屏
        language: '',             // 语言
        changeColor: '',          // 涨跌颜色设置，默认：红跌绿张
        currencyUnit: ''         // 显示哪个国家的货币
    },
    third: {
        gasPrice: null,                             // gasPrice分档次
        btcMinerFee: null,                          // btc minerfee 分档次
        gasLimitMap: new Map<string, number>(),     // 各种货币转账需要的gasLimit

        // shapeshift
        shapeShiftCoins: [],                                  // shapeShift 支持的币种
        shapeShiftMarketInfo: null,                           // shapeshift 汇率相关
        shapeShiftTxsMap: new Map<string, ShapeShiftTxs>(),   // shapeshift 交易记录Map

        rate: 0,                                            // 货币的美元汇率
        currency2USDTMap: new Map<string, Currency2USDT>()  // k线  --> 计算涨跌幅
    },
    flags: {}
};