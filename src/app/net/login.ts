/**
 * 钱包登录模块
 */

import { closeCon, open, reopen, setBottomLayerReloginMsg, setReloginCallback, setUrl } from '../../pi/net/ui/con_mgr';
import { popNew } from '../../pi/ui/root';
import { cryptoRandomInt } from '../../pi/util/math';
import { wsUrl } from '../config';
import { getDeviceAllDetail } from '../logic/native';
import { AddrInfo, CloudCurrencyType, CurrencyRecord, User, UserInfo, Wallet } from '../store/interface';
import { Account, getAllAccount, getStore, initCloudWallets, LocalCloudWallet,register, setStore } from '../store/memstore';
import { getCipherToolsMod, getGenmnemonicMod, getGlobalWalletClass, getWalletToolsMod } from '../utils/commonjsTools';
import { CMD, defaultPassword } from '../utils/constants';
import { closeAllPage, delPopPhoneTips, popNewLoading, popNewMessage, popPswBox } from '../utils/tools';
// tslint:disable-next-line:max-line-length
import { fetchBtcFees, fetchGasPrices, getBindPhone, getRealUser, getServerCloudBalance, getUserInfoFromServer, requestAsync, setUserInfo } from './pull';

declare var pi_update;
// 登录成功之后的回调列表
const loginedCallbackList:LoginType[] = [];

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
        if (getStore('flags').hasLogined) {
            setStore('user/isLogin',true);
        } else {
            loginWalletFailed();
        }
    }
});

/**
 * 钱包手动重连
 */
export const walletManualReconnect = () => {
    const conRandom = getStore('user/conRandom');
    console.log('walletManualReconnect called');
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
    console.time('loginMod start');
    console.time('loginMod open connect');
    open(conSuccess(secrectHash),conError,conClose,conReOpen);
};

/**
 * 连接成功回调
 */
const conSuccess = (secretHash:string) => {
    console.time('login');
    console.timeEnd('loginMod open connect');

    return () => {
        console.log('con success');
        setStore('user/offline',false);
        getRandom(secretHash);
    };
};

/**
 * 连接出错回调
 */
const conError = (err) => {
    console.log('con error');
    setStore('user/isLogin',false);
    setStore('user/offline',true);
};

/**
 * 连接关闭回调
 */
const conClose = () => {
    console.log('con close');
    setStore('user/isLogin',false);
    setStore('user/offline',true);
};

/**
 * 重新连接回调
 */
const conReOpen = () => {
    console.log('con reopen');
    setStore('user/offline',false);
    // console.log();
};

/**
 * 申请自动登录token
 */
export const applyAutoLogin = async () => {
    const deviceDetail =  await getDeviceAllDetail();
    const deviceId = deviceDetail.uuid.toString();
    const msg = { 
        type: 'wallet/user@set_auto_login', 
        param: { 
            device_id:deviceId
        }
    };
    requestAsync(msg).then(async (res) => {
        const cipherToolsMod = await getCipherToolsMod();
        const decryptToken = cipherToolsMod.encrypt(res.token,deviceId);
        setStore('user/token',decryptToken);
    });
};

/**
 * 自动登录
 */
export const autoLogin = async (conRandom:string) => {
    console.time('loginMod autoLogin');
    console.time('loginMod getCipherToolsMod');
    const [deviceDetail,cipherToolsMod] = await Promise.all([getDeviceAllDetail(),getCipherToolsMod()]);
    console.timeEnd('loginMod getCipherToolsMod');
    const token = cipherToolsMod.decrypt(getStore('user/token'),deviceDetail.uuid.toString());
    const param:any = {
        device_id: deviceDetail.uuid,
        token,
        random:conRandom
    };
    if (pi_update.inAndroidApp || pi_update.inIOSApp) {
        param.operator = deviceDetail.operator;
        param.network = deviceDetail.netWorkStatus;
        param.app_version = pi_update.updateJson.version;
    }
    const msg = { 
        type: 'wallet/user@auto_login', 
        param
    };
    console.log('autoLogin = ',msg);
    requestAsync(msg).then(res => {
        loginWalletSuccess();
        console.timeEnd('loginMod autoLogin');
        setStore('user/isLogin', true);
        console.timeEnd('loginMod start');
        console.log('自动登录成功-----------',res);
    }).catch((res) => {
        setStore('user/isLogin', false);
        if (res.error !== -69) {
            setStore('user/token','');
            loginWalletFailed();
        }
    });
};
/**
 * 创建钱包后默认登录
 * @param mnemonic 助记词
 */
export const defaultLogin = async (hash:string,conRandom:string) => {
    const walletToolsModPromise =  getWalletToolsMod();
    const GlobalWalletPromise =  getGlobalWalletClass();
    const genmnemonicModPromise =  getGenmnemonicMod();
    const deviceDetailPromise = getDeviceAllDetail();
    // tslint:disable-next-line:max-line-length
    const [walletToolsMod,GlobalWallet,genmnemonicMod,deviceDetail] = await Promise.all([walletToolsModPromise,GlobalWalletPromise,genmnemonicModPromise,deviceDetailPromise]);
    const getMnemonicByHash = walletToolsMod.getMnemonicByHash;
    const mnemonic = getMnemonicByHash(hash);
    const wlt = GlobalWallet.createWltByMnemonic(mnemonic,'ETH',0);
    console.log('================',wlt.exportPrivateKey());
    const sign = genmnemonicMod.sign;
    const signStr = sign(conRandom, wlt.exportPrivateKey());
    const param:any = { sign: signStr };
    if (pi_update.inAndroidApp || pi_update.inIOSApp) {
        param.operator = deviceDetail.operator;
        param.network = deviceDetail.netWorkStatus;
        param.app_version = pi_update.updateJson.version;
    }
    const msgLogin = { 
        type: 'login', 
        param
    };
    console.log('defaultLogin = ',msgLogin);

    return requestAsync(msgLogin).then((r:any) => {
        console.log('============================好嗨号acc_id:',r.acc_id);
        setStore('user/info/acc_id',r.acc_id,false);
        loginWalletSuccess();
        applyAutoLogin();
        setStore('user/isLogin', true);
    }).catch(err => {
        setStore('user/isLogin', false);
        if (err.error !== -69) {
            loginWalletFailed();
        }
    });

};

/**
 * 授权用户openID接口
 * @param appId appId 
 */
export const getOpenId = (appId:string) => {
    const msg = { type: 'get_openid', param: { appid:appId } };

    return requestAsync(msg);
};

/**
 * 获取随机数
 * flag:0 普通用户注册，1注册即为真实用户
 */
export const getRandom = async (secretHash:string,cmd?:number,phone?:number,code?:number,num?:string) => {
    console.time('loginMod getRandom');
    const wallet = getStore('wallet');
    if (!wallet) return;
    console.time('loginMod deviceId');
    const deviceDetail = await getDeviceAllDetail();
    console.timeEnd('loginMod deviceId');
    const param:any = {
        account: getStore('user/id').slice(2), 
        pk: `04${getStore('user/publicKey')}`,
        device_id:deviceDetail.uuid,
        flag:1
    };
    if (pi_update.inAndroidApp) {
        param.device_model = `${deviceDetail.manufacturer} ${deviceDetail.model}`;
        param.os = `android ${deviceDetail.version}`;
        param.total_memory = deviceDetail.total;
    } else if (pi_update.inIOSApp) {
        param.device_model = `${deviceDetail.manufacturer} ${deviceDetail.model}`;
        param.os = `ios ${deviceDetail.version}`;
        param.total_memory = deviceDetail.total;
    }
    
    if (cmd) {
        param.cmd = cmd;
    }
    if (phone) {
        param.phone = phone;
    }
    if (code) {
        param.code = code;
    }
    if (num) {
        param.num = num;
    }
    const msg = { 
        type: 'get_random', 
        param
    };
    console.log('getRandom = ',msg);
    let resp;
    try {
        resp = await requestAsync(msg);
        console.timeEnd('loginMod getRandom');
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
        console.log('uid =',resp.uid);
        setStore('user/conRandom', conRandom);
    } catch (res) {
        resp = res;
        const deviceDetail = await getDeviceAllDetail();
        if (res.type === 1014 && res.why !== deviceDetail.uuid) {  // 避免自己踢自己下线
            const flags = getStore('flags');
            console.log('flags =====',flags);
            if (flags.level_3_page_loaded) {  // 钱包创建成功直接提示,此时资源已经加载完成
                kickOffline(secretHash,phone,code,num);  // 踢人下线提示
            } else {  // 刷新页面后，此时资源没有加载完成,延迟到资源加载成功弹出提示
                localStorage.setItem('kickOffline',JSON.stringify(true));
            }
        } 
    } 
    console.log('getRandom resp = ',resp);

    return resp && (resp.type || resp.result);
};

/**
 * 注销账户并删除数据
 */
export const logoutAccountDel = (noLogin?:boolean) => {
    setStore('user/token','');
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
    setStore('flags/saveAccount', false);  
    setBottomLayerReloginMsg('','','');
    closeCon();
    logoutWalletSuccess();
    setTimeout(() => {
        openConnect();
    },100);
    if (!noLogin) {
        closeAllPage();
        if (getAllAccount().length > 0) {
            popNew('app-view-base-entrance1');
        } else {
            popNew('app-view-base-entrance');
        }
    }
    delPopPhoneTips();
};

/**
 * 注销账户保留数据
 */
export const logoutAccount = (noLogin?:boolean) => {
    const wallet = getStore('wallet');
    if (wallet.setPsw) {
        setStore('flags/saveAccount', true);
    }
    logoutAccountDel(noLogin);
};

/**
 * 登录成功
 */
export const loginSuccess = (account:Account,secretHash:string) => {    
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
    openConnect(secretHash);
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
export const kickOffline = (secretHash:string = '',phone?:number,code?:number,num?:string) => {
    popNew('app-components-modalBoxCheckBox-modalBoxCheckBox',{ 
        title:'检测到在其它设备有登录',
        content:'清除其它设备账户信息' 
    },(deleteAccount:boolean) => {
        if (deleteAccount) {
            getRandom(secretHash,CMD.FORCELOGOUTDEL,phone,code,num);
        } else {
            getRandom(secretHash,CMD.FORCELOGOUT,phone,code,num);
        }
    },() => {
        getRandom(secretHash,CMD.FORCELOGOUT);
    });
};

/**
 * 登录钱包并获取openId成功
 */
const loginWalletSuccess = () => {
    setStore('flags/hasLogined',true);  // 在当前生命周期内登录成功过 重登录的时候以此判断是否有登录权限

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
    loginWalletFailedPop();
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
    const wallet = getStore('wallet');
    let psw;
    let secretHash;
    if (!wallet.setPsw) {
        psw = defaultPassword;
        const walletToolsMod = await getWalletToolsMod();
        secretHash = await walletToolsMod.VerifyIdentidy(psw);
    } else {
        psw = await popPswBox([],true,true);
        if (!psw) {
            return;
        }
        const close = popNewLoading({ zh_Hans:'登录中',zh_Hant:'登錄中',en:'' });
        const walletToolsMod = await getWalletToolsMod();
        secretHash = await walletToolsMod.VerifyIdentidy(psw);
        close && close.callback(close.widget);
        if (!secretHash) {
            popNewMessage('密码错误,请重新输入');
            loginWalletFailedPop();

            return;
        }
        
    }
    const conRandom = getStore('user/conRandom');
    defaultLogin(secretHash,conRandom);
};

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
            // 用户基础信息
            getUserInfoFromServer(getStore('user/conUid')).then(() => {
                getBindPhone();
                // 获取真实用户
                getRealUser();
            });
        } 
        // eth gasPrice
        fetchGasPrices();

        // btc fees
        fetchBtcFees();
    });
};
