/**
 * 钱包登录模块
 */

import { closeCon, open, reopen, request, setBottomLayerReloginMsg, setReloginCallback, setUrl } from '../../pi/net/ui/con_mgr';
import { cryptoRandomInt } from '../../pi/util/math';
import { inAndroidApp, inIOSApp, wsUrl } from '../publicLib/config';
import { AddrInfo, CloudCurrencyType, CurrencyRecord, User, UserInfo, Wallet } from '../publicLib/interface';
import { Account, getAllAccount, getStore,initCloudWallets, LocalCloudWallet, register, setStore } from '../store/memstore';
import { addFirstRegisterListener } from '../store/vmRegister';
// tslint:disable-next-line:max-line-length
import { fetchBtcFees, fetchGasPrices, getBindPhone, getRealUser, getServerCloudBalance, getUserInfoFromServer, setUserInfo } from './pull';
import { getDeviceAllDetail } from './tools';
import { decrypt, encrypt } from './wallet';

declare var pi_modules;

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
 * 通用的异步通信 需要登录
 * 
 * 需要登录权限的接口
 * emit_red_bag  发红包
 * to_cash       eth提现
 * btc_to_cash   btc提现
 * manage_money@buy    购买理财
 * manage_money@sell   出售理财
 */
export const requestAsyncNeedLogin = async (msg: any,secretHash:string) => {
    const isLogin = getStore('user/isLogin');
    // if (!isLogin) {
    //     await defaultLogin(secretHash,getStore('user/conRandom'));
    // }

    return requestAsync(msg);
    
};

/**
 * 开启连接
 */
export const openConnect = (secretHash?:string) => {
    setUrl(wsUrl);
    open(conSuccess,conError,conClose,conReOpen);
};

/**
 * 连接成功回调
 */
const conSuccess = (secretHash:string) => {
    const token = getStore('user/token');
    setStore('user/offline',false);
    if (token) {
        autoLogin();
    } 
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
        const decryptToken = await encrypt(res.token,deviceId);
        setStore('user/token',decryptToken);
    });
};

/**
 * 自动登录
 */
export const autoLogin = async () => {
    const deviceDetail = await getDeviceAllDetail();
    const token = await decrypt(getStore('user/token'),deviceDetail.uuid.toString());
    const userId = getStore('user/id');
    const param:any = {
        userType:3,
        user:userId,
        device_id: deviceDetail.uuid,
        token
    };
    if (inAndroidApp || inIOSApp) {
        param.operator = deviceDetail.operator;
        param.network = deviceDetail.netWorkStatus;
        param.app_version = pi_modules.appVersion;
    }
    const msg = { 
        type: 'wallet/user@auto_login', 
        param
    };
    console.log('autoLogin = ',msg);
    requestAsync(msg).then(res => {
        setStore('flags/doLoginSuccess',true);
        setStore('user/isLogin', true);
        setStore('flags/hasLogined',true,false);  // 在当前生命周期内登录成功过 重登录的时候以此判断是否有登录权限
        console.log('自动登录成功-----------',res);
    }).catch((res) => {
        setStore('user/isLogin', false);
        if (res.error !== -69) {
            setStore('user/token','');
            setStore('flags/doLoginFailed',true);
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

// 游客登录
export const touristLogin = async () => {
    const uuid = getStore('setting/deviceId') || cryptoRandomInt().toString();
    setStore('setting/deviceId',uuid);
    const user = getStore('user');
    let userId = user.id;
    if (!userId) {
        userId = new Date().getTime();
        user.id = userId;
        setStore('user',user);
    }

    // tslint:disable-next-line:variable-name
    const device_id = uuid;
    const param = {
        userType:3,
        user:userId,
        pwd:'',
        device_id
    };
    const msg = {
        type:'login',
        param
    };
    
    return requestAsync(msg).then(res => {
        setStore('flags/isLogin',true);
        setStore('user/acc_id',res.acc_id);
        console.log('游客登录成功 =',res);
        applyAutoLogin();
    }).catch(res => {
        setStore('flags/isLogin',false);
    });
};

/**
 * 注销账户
 */
// tslint:disable-next-line:max-func-body-length
export const logoutAccount = async (save:boolean = true) => {
    let accounts:any = await getAllAccount();
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
    setStore('flags/doLogoutSuccess',true);  // 登出钱包
    setBottomLayerReloginMsg('','','');
    closeCon();
    setTimeout(() => {
        openConnect();
    },100);
    console.log('logoutAccount uid1 = ',uid);
    
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

    setStore('wallet',wallet);
    setStore('cloud',cloud);
    setStore('user',user);
    openConnect(secretHash);
};

// 注册store
const registerStore = () => {
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
            // getUserInfoFromServer(getStore('user/conUid')).then(() => {
            //     getBindPhone();
            //     // 获取真实用户
            //     getRealUser();
            // });
        } 
        // eth gasPrice
        // fetchGasPrices();

        // btc fees
        // fetchBtcFees();
        getRealUser();
    });
};

registerStore();

addFirstRegisterListener(openConnect);  // 在第一次注册成功后才连接服务器
