import { popNew } from '../../pi/ui/root';
// tslint:disable-next-line:max-line-length
import { callDefaultLogin, callGetAllAccount, callGetOpenId, callGetRandom, callLogoutAccount, callLogoutAccountDel,callVerifyIdentidy, getStoreData, openWSConnect,registerStore, setStoreData } from '../middleLayer/wrap';
import { CMD } from '../publicLib/config';
import { defaultPassword } from '../utils/constants';
import { closeAllPage, delPopPhoneTips, popNewLoading, popNewMessage, popPswBox } from '../utils/tools';
import { getSourceLoaded } from '../view/base/main';

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
    if (del) {
        await callLogoutAccountDel();
    } else {
        await callLogoutAccount();
    }
    delPopPhoneTips();
    if (!noLogin) {
        closeAllPage();
        const accounts = await callGetAllAccount();
        if (accounts.length > 0) {
            popNew('app-view-base-entrance1');
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
 * 登录钱包并获取openId成功
 */
const loginWalletSuccess = () => {
    setStoreData('flags/hasLogined',true);  // 在当前生命周期内登录成功过 重登录的时候以此判断是否有登录权限

    for (const loginType of loginedCallbackList) {
        callGetOpenId(loginType.appId).then(res => {
            loginType.success(res.openid);
        }).catch(err => {
            console.log(`appId ${loginType.appId} get openId failed`,err);
        });
    }
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
registerStore('flags/doLoginSuccess',(doLoginSuccess:boolean) => {
    loginWalletSuccess();
});

// 登录失败 执行失败操作
registerStore('flags/doLoginFailed',(doLogoutSuccess:boolean) => {
    loginWalletFailedPop();
});

// 登出成功 执行成功操作
registerStore('flags/doLogoutSuccess',(doLogoutSuccess:boolean) => {
    logoutWalletSuccess();
});

// 账号已经登录  踢人下线
registerStore('flags/kickOffline',(res:any) => {
    if (getSourceLoaded()) {
        kickOffline(res.secretHash,res.phone,res.code,res.num);
    } else {
        localStorage.setItem('kickOffline',JSON.stringify(res));
    }
});
