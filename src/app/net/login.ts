/**
 * 钱包登录模块
 */
import { open, setBottomLayerReloginMsg,setReloginCallback, setUrl } from '../../pi/net/ui/con_mgr';
import { wsUrl } from '../config';
import { getStore, register, setStore } from '../store/memstore';
import { decrypt, encrypt, fetchDeviceId, kickOffline, popPswBox } from '../utils/tools';
import { requestAsync } from './pull';

declare var pi_modules;

 // 设置重登录回调
setReloginCallback((res) => {
    const rtype = res.type;
    if (rtype === 'logerror') {  //  重登录失败，登录流程重走一遍
        openConnect();
    } else {
        setStore('user/isLogin',true);
    }
});
/**
 * 开启连接
 */
export const openConnect = (secrectHash:string = '') => {
    console.log('openConnect strat');
    setUrl(wsUrl);
    open(conSuccess(secrectHash),conError,conClose,conReOpen);
};

/**
 * 连接成功回调
 */
const conSuccess = (secrectHash:string) => {
    return () => {
        console.log('con success');
        setStore('user/offline',false);
        getRandom(secrectHash);
    };
};

/**
 * 连接出错回调
 */
const conError = (err) => {
    console.log('con error');
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
    const id = getStore('setting/deviceId') || await fetchDeviceId();
    const deviceId = id.toString();
    const msg = { 
        type: 'wallet/user@set_auto_login', 
        param: { 
            device_id:deviceId
        }
    };
    requestAsync(msg).then(res => {
        const decryptToken = encrypt(res.token,deviceId);
        setStore('user/token',decryptToken);
    });
};

/**
 * 自动登录
 */
export const autoLogin = async (conRandom:string) => {
    const deviceId = getStore('setting/deviceId') || await fetchDeviceId();
    console.log('deviceId -------',deviceId);
    const token = decrypt(getStore('user/token'),deviceId.toString());
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
    }).catch((res) => {
        setStore('user/token','');
        setStore('user/isLogin', false);
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
    }).catch(err => {
        setStore('user/isLogin', false);
    });

};

/**
 * 获取随机数
 * flag:0 普通用户注册，1注册即为真实用户
 */
export const getRandom = async (secretHash:string,cmd?:number) => {
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
    const msg = { 
        type: 'get_random', 
        param
    };
    try {
        const resp = await requestAsync(msg);
        // const serverTimestamp = resp.timestamp.value;
        const conRandom = resp.rand;
        if (getStore('user/token')) {
            autoLogin(conRandom);
        }
        if (secretHash) {
            defaultLogin(secretHash,conRandom);
        }

        setBottomLayerReloginMsg(resp.user,resp.userType,resp.password);
        
        setStore('user/conUid', resp.uid);
        setStore('user/conRandom', conRandom);
    } catch (resp) {
        if (resp.type === 1014) {
            const flags = getStore('flags');
            console.log('flags =====',flags);
            if (flags.level_2_page_loaded) {  // 钱包创建成功直接提示,此时资源已经加载完成
                kickOffline(secretHash);  // 踢人下线提示
            } else {  // 刷新页面后，此时资源没有加载完成,延迟到资源加载成功弹出提示
                localStorage.setItem('kickOffline',JSON.stringify(true));
            }
        }
    }
};

// 登录成功之后的回调列表
const loginedCallbackList = [];
/**
 * 登录钱包
 */
export const loginWallet = (cb:Function) => {
    loginedCallbackList.push(cb);
};

// ====================本地=========================
register('user/isLogin',async (isLogin:boolean) => {
    // if (isLogin) { // 登录成功
    //     for (const cb of loginedCallbackList) {
    //         cb();
    //     }
    // } else { // 登录失败
    //     const psw = await popPswBox();
    //     const close = popNew('app-components1-loading-loading', { text: '登录中' });
    //     const secretHash = await calcHashValuePromise(psw,getStore('user/salt'));
    //     const conRandom = getStore('user/conRandom');
    //     defaultLogin(secretHash,conRandom);
    //     close && close.callback(close.widget);
    // }
});