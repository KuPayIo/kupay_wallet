import { popNew } from '../../pi/ui/root';
import { defaultPassword } from '../config';
// tslint:disable-next-line:max-line-length
import { callDefaultLogin, callGetOpenId, callGetRandom, callLogoutAccount,callVerifyIdentidy, getStoreData, openWSConnect } from '../middleLayer/wrap';
import { getSourceLoaded } from '../postMessage/localLoaded';
import { CMD } from '../publicLib/config';
import { closeAllPage, delPopPhoneTips, popNewLoading, popNewMessage, popPswBox } from '../utils/tools';
import { registerStoreData } from './common';

/**
 * 密码弹框重新登录
 */
const loginWalletFailedPop = async () => {
    const wallet = await getStoreData('wallet');
    let psw;
    let secretHash;
    if (!wallet.setPsw) {
        psw = defaultPassword;
        secretHash = await callVerifyIdentidy(psw);
    } else {
        psw = await popPswBox([],true,true);
        if (!psw) {
            return;
        }
        const close = popNewLoading({ zh_Hans:'登录中',zh_Hant:'登錄中',en:'' });
        secretHash = await callVerifyIdentidy(psw);
        close && close.callback(close.widget);
        if (!secretHash) {
            popNewMessage('密码错误,请重新输入');
            loginWalletFailedPop();

            return;
        }
        
    }
    const conRandom = await getStoreData('user/conRandom');
    callDefaultLogin(secretHash,conRandom);
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
            callGetRandom(secretHash,CMD.FORCELOGOUTDEL,phone,code,num);
        } else {
            callGetRandom(secretHash,CMD.FORCELOGOUT,phone,code,num);
        }
    },() => {
        callGetRandom(secretHash,CMD.FORCELOGOUT);
    });
};

/**
 * 注销账户并删除数据
 */
export const logoutAccount = async (del:boolean = false,noLogin:boolean = false) => {
    let accounts; // [err,accounts]
    if (del) {
        accounts = await callLogoutAccount(false);
    } else {
        accounts = await callLogoutAccount();
    }
    delPopPhoneTips();
    if (!noLogin) {
        closeAllPage();
        if (accounts.length > 0) {
            popNew('app-view-base-entrance1',{ accounts });
        } else {
            popNew('app-view-base-entrance');
        }
    }
};

/**
 * 登录初始化
 */
export const loginInit = () => {
    openWSConnect();
};

interface LoginType {
    appId:string;
    success:Function;
}

// 登录成功之后的回调列表
const loginedCallbackList:LoginType[] = [];
let walletLogin;  // 钱包是否登录
/**
 * 登录钱包
 */
export const loginWallet = (appId:string,success:Function) => {
    const loginType:LoginType = {
        appId,
        success
    };
    loginedCallbackList.push(loginType);
    if (walletLogin) {
        loginWalletSuccess1(loginType);
    }
    
};

/**
 * 登录钱包并获取openId成功
 */
const loginWalletSuccess = () => {
    walletLogin = true;
    for (const loginType of loginedCallbackList) {
        loginWalletSuccess1(loginType);
    }
};

const loginWalletSuccess1 = (loginType:LoginType) => {
    callGetOpenId(loginType.appId).then(res => {
        loginType.success(res.openid);
    }).catch(err => {
        console.log(`appId ${loginType.appId} get openId failed`,err);
        // popNewMessage('openid 获取失败');
        loginWalletSuccess1(loginType);  // openid获取失败  尝试再次获取直到成功
    });
};

// 用户登出回调
const logoutCallbackList:Function[] = [];

/**
 * 登出钱包
 */
export const logoutWallet = (success:Function) => {
    logoutCallbackList.push(success);
};

/**
 * 钱包登出成功
 */
const logoutWalletSuccess =  () => {
    for (const logout of logoutCallbackList) {
        logout();
    }
};

// 登录成功 执行成功操作
registerStoreData('flags/doLoginSuccess',(doLoginSuccess:boolean) => {
    loginWalletSuccess();
});

// 登录失败 执行失败操作
registerStoreData('flags/doLoginFailed',(doLogoutSuccess:boolean) => {
    loginWalletFailedPop();
});

// 登出成功 执行成功操作
registerStoreData('flags/doLogoutSuccess',(doLogoutSuccess:boolean) => {
    logoutWalletSuccess();
});

// 账号已经登录  踢人下线
registerStoreData('flags/kickOffline',(res:any) => {
    if (getSourceLoaded()) {
        kickOffline(res.secretHash,res.phone,res.code,res.num);
    } else {
        localStorage.setItem('kickOffline',JSON.stringify(res));
    }
});
