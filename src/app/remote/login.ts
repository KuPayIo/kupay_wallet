/**
 * 钱包登录模块
 */

import { closeCon, open, reopen, request, setReloginCallback, setReloginMsg, setUrl } from '../../pi/net/ui/con_mgr';
import { cryptoRandomInt } from '../../pi/util/math';
import { wsUrl } from '../publicLib/config';
import { AddrInfo, CloudCurrencyType, CurrencyRecord, User, UserInfo, Wallet } from '../publicLib/interface';
import { Account, getAllAccount, getStore,initCloudWallets, LocalCloudWallet, register, setStore } from '../store/memstore';
import { registerVmComplete } from '../store/vmRegister';
import { clearAllTimer, initDataCenter } from './dataCenter';
import { setUserInfo } from './pull';
import { getDeviceId } from './tools';
import { decrypt, encrypt } from './wallet';

/**
 * 通用的异步通信
 */
export const requestAsync = (msg: any):Promise<any> => {
    return new Promise((resolve, reject) => {
        request(msg, (resp: any) => {
            if (resp.type) {
                console.log(`错误信息为${resp.type}`);
                reject(resp);
            } else if (resp.result !== 1) {
                reject(resp);
            } else {
                resolve(resp);
            }
        });
    });
};

/**
 * 开启连接
 */
export const openConnect = () => {
    setUrl(wsUrl);
    open(conSuccess,conError,conClose,conReOpen);
};

/**
 * 连接成功回调
 */
const conSuccess = () => {
    console.log('con success');
    setStore('user/offline',false);
    autoLogin();
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
};

/**
 * 设置重登录回调
 */
setReloginCallback((res) => {
    const rtype = res.type;
    console.log('relogin ',rtype);
    if (rtype === 'logerror') {  //  重登录失败，登录流程重走一遍
        openConnect();
    } else {
        if (getStore('flags').hasLogined) {
            setStore('user/isLogin',true);
        } else {
            setStore('flags/doLoginFailed',true);
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
 * 申请自动登录token
 */
export const applyAutoLogin = async () => {
    const deviceId = await getDeviceId();
    const msg = { 
        type: 'wallet/user@set_auto_login', 
        param: {}
    };
    requestAsync(msg).then(async (res) => {
        const decryptToken = await encrypt(res.token,deviceId);
        setStore('user/token',decryptToken);
    }).catch(r => {
        console.log('申请自动登陆失败',r);
    });
};

/**
 * 自动登录
 */
export const autoLogin = async () => {
    const deviceId = await getDeviceId();
    const token = await decrypt(getStore('user/token'),deviceId);
    const user = getStore('user');
    const param:any = {
        device_id: deviceId,
        token,
        user:user.conUid,
        userType:user.userType
    };
    const msg = { 
        type: 'wallet/user@auto_login', 
        param
    };
    requestAsync(msg).then(res => {
        setStore('user/isLogin', true);
        console.log('自动登录成功-----------',res);
    }).catch((res) => {
        setStore('user/isLogin', false);
        setStore('user/token','');
        console.log('自动登录失败-----------',res);
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

export enum UserType {
    wallet= 1,  
    tel= 2,   // 手机号
    wx= 3,   // 微信
    tourist= 4  // 游客
}

/**
 * 手动登录
 * @param userType 登录类型
 * @param user 登录账号
 * @param pwd 验证码 sid
 * @param device_id 设备ID
 * @param cmd 设备ID
 */
export const manualLogin = async (userType:UserType,user:string,pwd:string,cmd:number= 0,deviceId?:string) => {
    const device_id = deviceId ? deviceId :await getDeviceId();
    const param = {
        userType,
        user,
        pwd,
        device_id,
        cmd
    };
    const msg = {
        type:'login',
        param
    };
    
    return requestAsync(msg).then(res => {
        setStore('flags/isLogin',true);
        setStore('user/acc_id',res.acc_id);
        setReloginMsg(res.uid,userType,res.password);

    }).catch(res => {
        setStore('flags/isLogin',false);
        if (res.type === 1014 && res.why !== device_id) {    // 避免自己踢自己下线
            setStore('flags/kickOffline',{ userType,user,pwd,device_id });
        }
    });
};

/**
 * 注销账户
 */
// tslint:disable-next-line:max-func-body-length
export const logoutAccount = async (save:boolean = true) => {
    let accounts = await getAllAccount();
    const wallet = getStore('wallet');
    setStore('flags/saveAccount', false , false); // 重置saveAccount
    if (save && wallet.setPsw) {
        setStore('flags/saveAccount', true,false);
    }
    
    setStore('user/token','',false);
    const uid = getStore('user/id');
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
            avatar: '',             // 头像
            phoneNumber: '',        // 手机号
            areaCode:'86',          // 区域码
            isRealUser: false,       // 是否是真实用户
            acc_id:'',                // 好嗨号
            sex:0                    // 性别
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
    setStore('user',user);
    setStore('wallet',null,false);
    setStore('cloud',cloud,false);
    setStore('activity',activity,false);
    setStore('setting/lockScreen',lockScreen);
    setReloginMsg('','','');
    closeCon();
    setTimeout(() => {
        openConnect();
    },100);
    clearAllTimer();
    console.log('logoutAccount uid = ',uid);
    
    const uids = [];
    accounts.forEach(item => {
        uids.push(item.user.id);
    });
    console.log('logoutAccount uids = ',JSON.stringify(uids));
    const flags = getStore('flags');
    const saveAccount = flags.saveAccount;
    if (saveAccount) {
        return accounts;
    } else {
        accounts = accounts.filter(account => {
            return account.user.id !== uid;
        });

        const filterUids = [];
        accounts.forEach(item => {
            filterUids.push(item.user.id);
        });
        console.log('logoutAccount uid2 = ',uid);
        console.log('logoutAccount filterUids = ',JSON.stringify(filterUids));

        return accounts;
    }
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

    setStore('wallet',wallet);
    setStore('cloud',cloud);
    setStore('user',user);
    openConnect();
    initDataCenter();
};

// 注册store
const registerStore = () => {
    // 用户信息变化
    register('user/info', (userInfo: UserInfo) => {
        if (userInfo) {
            setUserInfo();
        }
    });
};
registerStore();
registerVmComplete(openConnect);  // 在第一次注册成功后才连接服务器
