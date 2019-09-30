import { getStore as gameGetStore,setStore as gameSetStore } from '../../earn/client/app/store/memstore';
import { popModalBoxs, popNew } from '../../pi/ui/root';
import { getLang } from '../../pi/util/lang';
import { getHighTop } from '../net/pull';
import { CloudCurrencyType } from '../public/interface';
import { getPopPhoneTips, getStaticLanguage } from '../utils/tools';
import { closeAllPage, popNewMessage } from './pureUtils';

/**
 * 服务器推送处理
 */

// 强制被踢下线
export const forceOffline = () => {
    popNew('app-components-modalBox-modalBox',{
        sureText:{ zh_Hans:'重新登录',zh_Hant:'重新登錄',en:'' },
        cancelText:{ zh_Hans:'退出',zh_Hant:'退出',en:'' },
        title:{ zh_Hans:'下线通知',zh_Hant:'下線通知',en:'' },
        content:{ zh_Hans:'您的账户已被下线，如非本人操作，则助记词可能已泄露。',zh_Hant:'您的賬戶已被下線，如非本人操作，則助記詞可能已洩露。',en:'' }
    }, () => {
        setTimeout(async () => {
            closeAllPage();
            // TODO 跳转登录页面
        },100);
    },() => {
        setTimeout(async () => {
            closeAllPage();
            // TODO  跳转登录页面
        },100);
    });
};

// 充值成功
export const payOk = () => {
    popNewMessage(getStaticLanguage().transfer.rechargeTips);
};

// 设置密码弹框
export const setPswPop = () => {
    setTimeout(() => {
        const modalBox = { 
            zh_Hans:{
                title:'设置密码',
                content:'为了您的资产安全，请您立即设置支付密码',
                sureText:'去设置',
                onlyOk:true
            },
            zh_Hant:{
                title:'設置密碼',
                content:'為了您的資產安全，請您立即設置支付密碼',
                sureText:'去設置',
                onlyOk:true
            },
            en:'' 
        };
        popModalBoxs('app-components-modalBox-modalBox',modalBox[getLang()],() => {  
            popNew('app-view-mine-setting-settingPsw',{});
        },undefined,true);
    },2000);
};

// 绑定手机弹框
export const bindPhonePop = () => {
    setTimeout(() => {
        popModalBoxs('app-components-modalBox-modalBox',getPopPhoneTips(),() => { 
            popNew('app-view-mine-setting-phone',{ jump:true });
        },undefined,true);    
    },2000);
};

// 余额变化  密码弹框或手机弹框
export const balanceChange = (args:any) => {
    if (args.popType === 0) {
        setPswPop();
    } else if (args.popType === 1) {
        bindPhonePop();
    }
    if (args.cointype === CloudCurrencyType.KT) {
        getHighTop(100).then((data) => {
            const mine = gameGetStore('mine',{});
            mine.miningRank = data.miningRank || 0;
            gameSetStore('mine',mine);  
        });
        console.log('KT余额变化');
    }
};
