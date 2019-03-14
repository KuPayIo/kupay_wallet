/**
 * 钱包登录模块
 */
import * as chatStore from '../../chat/client/app/data/store';
import { getStore as earnGetStore,register as earnRegister } from '../../earn/client/app/store/memstore';
import { closeCon, open, reopen, setBottomLayerReloginMsg, setReloginCallback, setUrl } from '../../pi/net/ui/con_mgr';
import { popNew } from '../../pi/ui/root';
import { cryptoRandomInt } from '../../pi/util/math';
import { wsUrl } from '../config';
import { AddrInfo, CloudCurrencyType, CurrencyRecord, User, UserInfo, Wallet } from '../store/interface';
import { Account, getStore, initCloudWallets, LocalCloudWallet, register,setStore } from '../store/memstore';
import { getWalletTools } from '../utils/commonjsTools';
import { CMD } from '../utils/constants';
import { fetchDeviceId, popNewMessage, popPswBox } from '../utils/tools';
import { fetchBtcFees, fetchGasPrices, getRealUser, getServerCloudBalance, getUserInfoFromServer, requestAsync, setUserInfo } from './pull';
import { setReconnectingState } from './reconnect';

declare var pi_modules;

// 登录成功之后的回调列表
const loginedCallbackList:LoginType[] = [];

// 登录失败延迟执行函数
let loginWalletFailedDelay;

// 用户登出回调
const logoutCallbackList:Function[] = [];

interface LoginType {
    appId:string;
    success:Function;
}

 // 设置重登录回调
setReloginCallback((res) => {
    const rtype = res.type;
    console.log('relogin ',rtype);
    if (rtype === 'logerror') {  //  重登录失败，登录流程重走一遍
        openConnect();
    } else {
        setStore('user/isLogin',true);
    }
});

/**
 * 钱包手动重连
 */
export const walletManualReconnect = () => {
    
    const conRandom = getStore('user/conRandom');
    if (conRandom) {
        console.log('walletManualReconnect reopen');
        reopen(conReOpen);
    } else {
        console.log('walletManualReconnect openConnect');
        openConnect();
    }
};

/**
 * 开启连接
 */
export const openConnect = (secrectHash:string = '') => {
    
    console.log('openConnect strat');
    setUrl(wsUrl);
    open(conSuccess(secrectHash),conError,conClose,conReOpen);
};

const reconnectinName = 'wallet';
/**
 * 连接成功回调
 */
const conSuccess = (secrectHash:string) => {
    return () => {
        console.log('con success');
        setStore('user/offline',false);
        getRandom(secrectHash);
        setReconnectingState(reconnectinName,false);
    };
};

/**
 * 连接出错回调
 */
const conError = (err) => {
    console.log('con error');
    setStore('user/isLogin',false);
    setStore('user/offline',true);
    setReconnectingState(reconnectinName,false);
};

/**
 * 连接关闭回调
 */
const conClose = () => {
    console.log('con close');
    setStore('user/isLogin',false);
    setStore('user/offline',true);
    setReconnectingState(reconnectinName,false);
};

/**
 * 重新连接回调
 */
const conReOpen = () => {
    console.log('con reopen');
    setStore('user/offline',false);
    setReconnectingState(reconnectinName,false);
    // console.log();
};

/**
 * 申请自动登录token
 */
export const applyAutoLogin = async () => {
    const id = getStore('setting/deviceId') || await fetchDeviceId();
    const deviceId = id.toString();
    const msg = { 
        type: 'wallet/user@set_auto_login', 
        param: { 
            device_id:deviceId
        }
    };
    requestAsync(msg).then(async (res) => {
        const walletToolsMod = await getWalletTools();
        const decryptToken = walletToolsMod.encrypt(res.token,deviceId);
        setStore('user/token',decryptToken);
    });
};

/**
 * 自动登录
 */
export const autoLogin = async (conRandom:string) => {
    const deviceId = getStore('setting/deviceId') || await fetchDeviceId();
    console.log('deviceId -------',deviceId);
    const walletToolsMod = await getWalletTools();
    const token = walletToolsMod.decrypt(getStore('user/token'),deviceId.toString());
    const msg = { 
        type: 'wallet/user@auto_login', 
        param: { 
            device_id: deviceId,
            token,
            random:conRandom
        }
    };
    requestAsync(msg).then(res => {
        setStore('user/isLogin', true);
        console.log('自动登录成功-----------',res);
        loginWalletSuccess();
    }).catch((res) => {
        setStore('user/token','');
        setStore('user/isLogin', false);
        loginWalletFailed();
    });
};
/**
 * 创建钱包后默认登录
 * @param mnemonic 助记词
 */
export const defaultLogin = (hash:string,conRandom:string) => {
    const getMnemonicByHash = pi_modules.commonjs.exports.relativeGet('app/utils/walletTools').exports.getMnemonicByHash;
    const mnemonic = getMnemonicByHash(hash);
    const GlobalWallet = pi_modules.commonjs.exports.relativeGet('app/core/globalWallet').exports.GlobalWallet;
    const wlt = GlobalWallet.createWltByMnemonic(mnemonic,'ETH',0);
    console.log('================',wlt.exportPrivateKey());
    const sign = pi_modules.commonjs.exports.relativeGet('app/core/genmnemonic').exports.sign;
    const signStr = sign(conRandom, wlt.exportPrivateKey());
    const msgLogin = { type: 'login', param: { sign: signStr } };

    return requestAsync(msgLogin).then(() => {
        applyAutoLogin();
        setStore('user/isLogin', true);
        loginWalletSuccess();
    }).catch(err => {
        setStore('user/isLogin', false);
        loginWalletFailed();
    });

};

/**
 * 获取openId
 */
export const getOpenId = (appId:string) => {
    const msg = { type: 'get_openid', param: { appid:appId } };

    return requestAsync(msg);
};

/**
 * 获取随机数
 * flag:0 普通用户注册，1注册即为真实用户
 */
export const getRandom = async (secretHash:string,cmd?:number,phone?:number,code?:number) => {
    console.log('getRandom--------------');
    const wallet = getStore('wallet');
    if (!wallet) return;
    const deviceInfo = getStore('setting/deviceInfo') || {};
    const client = deviceInfo.system || navigator.userAgent;
    const param:any = {
        account: getStore('user/id').slice(2), 
        pk: `04${getStore('user/publicKey')}`,
        client:JSON.stringify(client),
        flag:1
    };
    if (cmd) {
        param.cmd = cmd;
    }
    if (phone) {
        param.phone = phone;
    }
    if (code) {
        param.code = code;
    }
    const msg = { 
        type: 'get_random', 
        param
    };
    let resp;
    try {
        resp = await requestAsync(msg);
        // const serverTimestamp = resp.timestamp.value;
        const conRandom = resp.rand;
        if (secretHash) {
            defaultLogin(secretHash,conRandom);
        } else {
            if (getStore('user/token')) {
                autoLogin(conRandom);
            } else {
                loginWalletFailed();
            }
        }

        setBottomLayerReloginMsg(resp.user,resp.userType,resp.password);
        
        setStore('user/conUid', resp.uid);
        setStore('user/conRandom', conRandom);
    } catch (resp) {
        if (resp.type === 1014) {
            const flags = getStore('flags');
            console.log('flags =====',flags);
            if (flags.level_3_page_loaded) {  // 钱包创建成功直接提示,此时资源已经加载完成
                kickOffline(secretHash);  // 踢人下线提示
            } else {  // 刷新页面后，此时资源没有加载完成,延迟到资源加载成功弹出提示
                localStorage.setItem('kickOffline',JSON.stringify(true));
            }
        } 
    } 

    return resp && resp.type;
};

/**
 * 注销账户并删除数据
 */
export const logoutAccountDel = () => {
    const user = {
        id: '',                      // 该账号的id
        isLogin: false,              // 登录状态
        offline:false,                // 在线状态
        allIsLogin:false,            // 所有服务登录状态  (钱包  活动  聊天)
        token: '',                   // 自动登录token
        conRandom: '',               // 连接随机数
        conUid: '',                   // 服务器连接uid
        publicKey: '',               // 用户公钥, 第一个以太坊地址的公钥
        salt: cryptoRandomInt().toString(),                    // 加密 盐值
        secretHash: '',             // 密码hash缓存   
        info: {                      // 用户基本信息
            nickName: '',           // 昵称
            avatar: '',            // 头像
            phoneNumber: '',       // 手机号
            isRealUser: false    // 是否是真实用户
        }
    };
    const cloud = {
        cloudWallets: initCloudWallets()     // 云端钱包相关数据, 余额  充值提现记录...
    };
    
    const activity = {
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
    };

    let lockScreen = getStore('setting/lockScreen');
    lockScreen = {
        psw:'',
        open:false
    };
    setStore('wallet',null,false);
    setStore('cloud',cloud,false);
    setStore('user',user);
    setStore('activity',activity);
    setStore('setting/lockScreen',lockScreen);
    setBottomLayerReloginMsg('','','');
    closeCon();
    logoutWalletSuccess();
    setTimeout(() => {
        openConnect();
    },100);
    
};

/**
 * 注销账户保留数据
 */
export const logoutAccount = () => {
    setStore('flags/saveAccount', true);
    logoutAccountDel();
};

/**
 * 登录成功
 */
export const loginSuccess = (account:Account) => {    
    const fileUser = account.user;
    const user:User = {
        isLogin: true,
        offline:true,
        allIsLogin:true,
        conRandom:'',
        conUid:'',
        id : fileUser.id,
        token : fileUser.token,
        publicKey : fileUser.publicKey,
        salt : fileUser.salt,
        info : { ...fileUser.info }
    };
   
    const localWallet = account.wallet;
    const currencyRecords = [];
    for (const localRecord of localWallet.currencyRecords) {
        const addrs = [];
        for (const info of localRecord.addrs) {
            const addrInfo:AddrInfo = {
                addr:info.addr,
                balance:info.balance,
                txHistory:[]
            };
            addrs.push(addrInfo);
        }
        const record:CurrencyRecord = {
            currencyName: localRecord.currencyName,           
            currentAddr: localRecord.currentAddr ,           
            addrs,             
            updateAddr: localRecord.updateAddr         
        };
        currencyRecords.push(record);
    }
    const wallet:Wallet = {
        vault:localWallet.vault,
        setPsw:true,
        backupTip:false,               
        isBackup: localWallet.isBackup,
        sharePart:false, 
        helpWord:false,                
        showCurrencys: localWallet.showCurrencys,           
        currencyRecords,
        changellyPayinAddress:[],
        changellyTempTxs:[]
    };
  
    const cloud = getStore('cloud');
    const localCloudWallets = new Map<CloudCurrencyType, LocalCloudWallet>(account.cloud.cloudWallets);
    for (const [key,value] of localCloudWallets) {
        const cloudWallet = cloud.cloudWallets.get(key);
        cloudWallet.balance = localCloudWallets.get(key).balance;
    }

    setStore('wallet',wallet,false);
    setStore('cloud',cloud,false);
    setStore('user',user);
    setStore('flags',{ level_3_page_loaded:true });
    openConnect();
};

/**
 * 登录钱包
 */
export const loginWallet = (appId:string,success:Function) => {
    const loginType:LoginType = {
        appId,
        success
    };
    loginedCallbackList.push(loginType);
    const isLogin = getStore('user/isLogin');
    if (isLogin) {
        loginWalletSuccess();
    }
};

/**
 * 登出钱包
 */
export const logoutWallet = (success:Function) => {
    logoutCallbackList.push(success);
};

/**
 * 踢人下线提示
 * @param secretHash 密码
 */
export const kickOffline = (secretHash:string = '') => {
    popNew('app-components-modalBoxCheckBox-modalBoxCheckBox',{ 
        title:'检测到在其它设备有登录',
        content:'清除其它设备账户信息' 
    },(deleteAccount:boolean) => {
        if (deleteAccount) {
            getRandom(secretHash,CMD.FORCELOGOUTDEL);
        } else {
            getRandom(secretHash,CMD.FORCELOGOUT);
        }
    },() => {
        getRandom(secretHash,CMD.FORCELOGOUT);
    });
};

/**
 * 登录钱包并获取openId成功
 */
const loginWalletSuccess = () => {
    for (const loginType of loginedCallbackList) {
        getOpenId(loginType.appId).then(res => {
            loginType.success(res.openid);
        }).catch(err => {
            console.log(`appId ${loginType.appId} get openId failed`,err);
        });
    }
};

/**
 * 钱包登录失败
 */
const loginWalletFailed =  () => {
    const flags = getStore('flags');  
    const loaded = flags.level_3_page_loaded; // 资源已经加载完成
    if (loaded) {
        loginWalletFailedPop();
    } else {
        loginWalletFailedDelay = loginWalletFailedPop;
    }

};

/**
 * 钱包登出成功
 */
const logoutWalletSuccess =  () => {
    for (const logout of logoutCallbackList) {
        logout();
    }
};

/**
 * 密码弹框重新登录
 */
const loginWalletFailedPop = async () => {
    const psw = await popPswBox();
    if (!psw) {
        logoutAccount();

        return;
    }
    const close = popNew('app-components1-loading-loading', { text: '登录中' });
    const walletToolsMod = await getWalletTools();
    const secretHash = await walletToolsMod.VerifyIdentidy(psw);
    close && close.callback(close.widget);
    if (!secretHash) {
        popNewMessage('密码错误,请重新输入');
        loginWalletFailedPop();

        return;
    }
    const conRandom = getStore('user/conRandom');
    defaultLogin(secretHash,conRandom);
};

/**
 * 设置allIsLogin
 */
const setAllIsLogin = () => {
    const newAllIsLogin =  getStore('user/isLogin') && earnGetStore('userInfo/isLogin') && chatStore.getStore('isLogin');
    setStore('user/allIsLogin',newAllIsLogin);
};
// =======================资源加载完成========================
register('flags/level_3_page_loaded', (loaded: boolean) => {
    loginWalletFailedDelay && loginWalletFailedDelay();
});

// 注册store
export const registerStore = () => {
    // 用户信息变化
    register('user/info', (userInfo: UserInfo) => {
        if (userInfo) {
            setUserInfo();
        }
    });

        // 登录状态成功
    register('user/isLogin', (isLogin: boolean) => {
        if (isLogin) {
                // 余额
            getServerCloudBalance();

                // 获取真实用户
            getRealUser();
                // 用户基础信息
            getUserInfoFromServer(getStore('user/conUid'));
            
        } 
    });

        // 获取随机数成功
    register('user/conRandom',() => {
            // eth gasPrice
        fetchGasPrices();

            // btc fees
        fetchBtcFees();

    });

    // 钱包login
    register('user/isLogin', () => {
        setAllIsLogin();
    });

    // 赚钱login
    earnRegister('userInfo/isLogin', () => {
        setAllIsLogin();
    });

    // 聊天login
    chatStore.register('isLogin', () => {
        setAllIsLogin();
    });
};
