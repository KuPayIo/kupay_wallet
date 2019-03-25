/**
 * 后端主动推消息给后端
 */
import { setBottomLayerReloginMsg, setMsgHandler } from '../../pi/net/ui/con_mgr';
import { popNew } from '../../pi/ui/root';
import { getAllAccount, getStore, register, setStore } from '../store/memstore';
import { CMD } from '../utils/constants';
import { closeAllPage, getStaticLanguage, getUserInfo, popNewMessage } from '../utils/tools';
import { logoutAccount, logoutAccountDel } from './login';
import { getServerCloudBalance } from './pull';

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
        const value = res.value.toJSNumber ? res.value.toJSNumber() : res.value;
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
        const invite = getStore('flags').invite_success || [];
        invite.push(res.accId);
        setStore('flags/invite_success',invite);
    });

    // 监听兑换邀请码成功事件
    setPushListener('event_convert_invite',(res) => {
        console.log('event_convert_invite服务器推送兑换邀请码成功=====================',res);
        const invite = getStore('flags').convert_invite || [];
        invite.push(res.accId);
        setStore('flags/convert_invite',invite);
    });

    // 监听余额变化事件
    setMsgHandler('alter_balance_ok',(res) => {
        console.log('alter_balance_ok服务器推送成功==========================',res);
        getServerCloudBalance();
        const wallet = getStore('wallet');
        const userInfo = getUserInfo();
        if (!wallet.setPsw) {
            setTimeout(() => {
                popNew('app-view-mine-setting-settingPsw',{});
            },2000);
            
        } else if (!userInfo.phoneNumber) {
            setTimeout(() => {
                popNew('app-components-allModalBox-modalBox3', {
                    img:'app/res/image/bind_phone.png',
                    tipTitle:'安全提醒',
                    tipContent:`手机号是您找回云端资产的凭证
为了您的资产安全请输入手机号`,
                    btn:`验证手机`
                },() => {
                    popNew('app-view-mine-setting-phone',{ jump:true });
                });
            },2000);
            
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