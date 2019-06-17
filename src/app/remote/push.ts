/**
 * 后端主动推消息给后端
 */
import { setBottomLayerReloginMsg, setMsgHandler } from '../../pi/net/ui/con_mgr';
import { CMD } from '../publicLib/config';
import { CloudCurrencyType } from '../publicLib/interface';
import { getStore, register, setStore } from '../store/memstore';
import { logoutAccount, logoutAccountDel } from './login';
import { getServerCloudBalance } from './pull';

// ===================================================== 导入

// ===================================================== 导出

let forceOffline:Function = () => {
    console.log('强制被踢下线');
};

// 设置强制被踢下线提示弹框
export const setForceOffline = (callback:Function) => {
    forceOffline = callback;
};

let payOk:Function = () => {
    console.log('充值成功');
};

// 设置充值成功提示
export const setPayOk = (callback:Function) => {
    payOk = callback;
};

let setPswPop:Function = () => {
    console.log('余额变化  要求设置密码');
};

// 设置密码弹框
export const setSetPswPop = (callback:Function) => {
    setPswPop = callback;
};

let bindPhonePop:Function = () => {
    console.log('余额变化 绑定手机弹框');
};

// 设置绑定手机弹框
export const setBindPhonePop = (callback:Function) => {
    bindPhonePop = callback;
};
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
       
        return forceOffline;
    });

    // 监听充值成功事件
    setPushListener('event_pay_ok',(res) => {
        // const value = res.value.toJSNumber ? res.value.toJSNumber() : res.value;
        getServerCloudBalance().then(res => {
            console.log('服务器推送成功 云端余额更新==========================',res);
        });
        console.log('服务器推送成功==========================',res);

        return payOk;
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
        getServerCloudBalance();
        if (res.cointype === CloudCurrencyType.KT) {
            // TODO 界面层实现
            // getHighTop(100).then((data) => {
            //     const mine = gameGetStore('mine',{});
            //     mine.miningRank = data.miningRank || 0;
            //     gameSetStore('mine',mine);  
            // });
        }
        
        const wallet = getStore('wallet');
        const userInfo = getStore('user/info');
        if (!wallet.setPsw) {
            const setPsw = getStore('flags').setPsw;
            if (setPsw) return;
            setStore('flags/setPsw',true);  // 防止多次弹窗
            setPswPop();
        } else if (!userInfo.phoneNumber) {
            const bindPhone = getStore('flags').bindPhone;
            if (bindPhone) return;
            setStore('flags/bindPhone',true);  // 防止多次弹窗
            bindPhonePop();
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