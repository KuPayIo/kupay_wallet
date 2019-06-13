import { popNew } from '../../pi/ui/root';
import { callGetAllAccount, getStoreData } from '../middleLayer/memBridge';
// tslint:disable-next-line:max-line-length
import { callDefaultLogin, callGetRandom, callLogoutAccountDel, callSetKickOffline, callSetLoginWalletFailed, openWSConnect } from '../middleLayer/netBridge';
import { callVerifyIdentidy } from '../middleLayer/walletBridge';
import { CMD } from '../publicLib/config';
import { defaultPassword } from '../utils/constants';
import { closeAllPage, delPopPhoneTips, popNewLoading, popNewMessage, popPswBox } from '../utils/tools';

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
export const logoutAccountDel = async (noLogin?:boolean) => {
    await callLogoutAccountDel();
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
    callSetLoginWalletFailed(loginWalletFailedPop);
    callSetKickOffline(kickOffline);
    openWSConnect();
};