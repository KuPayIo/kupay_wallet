/**
 * 后端主动推消息给后端
 */
import { setBottomLayerReloginMsg, setMsgHandler } from '../../pi/net/ui/con_mgr';
import { popModalBoxs, popNew } from '../../pi/ui/root';
import { getLang } from '../../pi/util/lang';
import { getAllAccount, getStore, register, setStore } from '../store/memstore';
import { CMD } from '../utils/constants';
import { closeAllPage, getPopPhoneTips, getStaticLanguage, getUserInfo, popNewMessage } from '../utils/tools';
import { logoutAccount, logoutAccountDel } from './login';
import { getHighTop, getServerCloudBalance } from './pull';

// ===================================================== 导入

// ===================================================== 导出

/**
 * 主动推送初始化
 */ 
// tslint:disable-next-line:max-func-body-length
export const initPush = () => {
    // 监听指令事件
    setPushListener('cmd',(res) => {
        console.log('强制下线==========================',res);
        setBottomLayerReloginMsg('','','');
        const cmd = res.cmd;
        if (cmd === CMD.FORCELOGOUT) {
            logoutAccount(true);
        } else if (cmd === CMD.FORCELOGOUTDEL) {
            logoutAccountDel(true);
        }
       
        return () => {
            popNew('app-components-modalBox-modalBox',{
                sureText:{ zh_Hans:'重新登录',zh_Hant:'重新登錄',en:'' },
                cancelText:{ zh_Hans:'退出',zh_Hant:'退出',en:'' },
                title:{ zh_Hans:'下线通知',zh_Hant:'下線通知',en:'' },
                content:{ zh_Hans:'您的账户已被下线，如非本人操作，则助记词可能已泄露。',zh_Hant:'您的賬戶已被下線，如非本人操作，則助記詞可能已洩露。',en:'' }
            },() => {
                setTimeout(() => {
                    closeAllPage();
                    if (getAllAccount().length > 0) {
                        popNew('app-view-base-entrance1');
                    } else {
                        popNew('app-view-base-entrance');
                    }
                },100);
            },() => {
                setTimeout(() => {
                    closeAllPage();
                    if (getAllAccount().length > 0) {
                        popNew('app-view-base-entrance1');
                    } else {
                        popNew('app-view-base-entrance');
                    }
                },100);
            });
        };

    });

    // 监听充值成功事件
    setPushListener('event_pay_ok',(res) => {
        // const value = res.value.toJSNumber ? res.value.toJSNumber() : res.value;
        getServerCloudBalance().then(res => {
            console.log('服务器推送成功 云端余额更新==========================',res);
        });
        console.log('服务器推送成功==========================',res);

        return () => {
            popNewMessage(getStaticLanguage().transfer.rechargeTips);
        };
    });

    // 监听邀请好友成功事件
    setPushListener('event_invite_success',(res) => {
        console.log('event_invite_success服务器推送邀请好友成功=====================',res);
        const invite = getStore('inviteUsers').invite_success || [];
        
        if (res.accId) {
            const index = invite.indexOf(res.accId);
            index === -1 && invite.push(res.accId);
        }
        setStore('inviteUsers/invite_success',invite);
    });

    // 监听兑换邀请码成功事件
    setPushListener('event_convert_invite',(res) => {
        console.log('event_convert_invite服务器推送兑换邀请码成功=====================',res);
        let invite = [];
        if (res.accId) {
            invite = [res.accId];
        }
        setStore('inviteUsers/convert_invite',invite);
    });

    // 监听邀请好友并成为真实用户事件
    setPushListener('event_invite_real',(res) => {
        console.log('event_invite_real服务器推送邀请好友并成为真实用户===============',res);
        setStore('flags/invite_realUser',res.num);
    });

    // 监听余额变化事件
    setMsgHandler('alter_balance_ok',(res) => {
        console.log('alter_balance_ok服务器推送成功===========调用排名===============',res);
        
        getServerCloudBalance().then(() => {
            getHighTop(100);
        });
        const wallet = getStore('wallet');
        const userInfo = getUserInfo();
        if (!wallet.setPsw) {
            const setPsw = getStore('flags').setPsw;
            if (setPsw) return;
            setStore('flags/setPsw',true);  // 防止多次弹窗
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
                
            },3000);
            
        } else if (!userInfo.phoneNumber) {
            const bindPhone = getStore('flags').bindPhone;
            if (bindPhone) return;
            setStore('flags/bindPhone',true);  // 防止多次弹窗
            setTimeout(() => {
                popModalBoxs('app-components-modalBox-modalBox',getPopPhoneTips(),() => { 
                    popNew('app-view-mine-setting-phone',{ jump:true });
                },undefined,true);      
            },3000);
            
        }
        
    });

    // setMsgHandler('event_kt_alert',(res) => {
    //     console.log('event_kt_alert服务器推送成功==========================',res);
    // });
};

// ===================================================== 本地
// 推送回调列表
let pushCallBackList = [];

/**
 * 设置推送监听,对setMsgHandler的封装
 *
 */
const setPushListener = (key:string,callback:Function) => {
    setMsgHandler(key,(res) => {
        const popTips = callback(res);
        const flags = getStore('flags');  
        const loaded = flags.level_3_page_loaded; // 资源已经加载完成
        if (loaded) {
            popTips && popTips(res);
        } else {
            pushCallBackList.push(() => {
                popTips && popTips(res);
            });
        }
    });
};

register('flags/level_3_page_loaded',(loaded: boolean) => {
    // 将缓冲池中的回调函数都执行
    for (const cb of pushCallBackList) {
        cb();
    }
    pushCallBackList = [];
});