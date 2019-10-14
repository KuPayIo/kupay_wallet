/**
 * 后端主动推消息给后端
 */
import { setBottomLayerReloginMsg, setMsgHandler } from '../../pi/net/ui/con_mgr';
import { CMD } from '../public/config';
import { ServerPushKey } from '../public/interface';
import { getStore, setStore } from '../store/memstore';
import { balanceChange, payOk } from '../utils/serverPushLogic';
import { getServerCloudBalance } from './pull';

// ===================================================== 导入

// ===================================================== 导出
/**
 * 主动推送初始化
 */ 
// tslint:disable-next-line:max-func-body-length
export const initPush = () => {
    // 监听指令事件
    setMsgHandler(ServerPushKey.CMD,(res) => {
        console.log('强制下线==========================',res);
        setBottomLayerReloginMsg('','','');
        const cmd = res.cmd;
        if (cmd === CMD.FORCELOGOUT) {
            // logoutAccount();
        } else if (cmd === CMD.FORCELOGOUTDEL) {
            // logoutAccount(false);
        }
    });

    // 监听充值成功事件
    setMsgHandler(ServerPushKey.EVENTPAYOK,(res) => {
        // const value = res.value.toJSNumber ? res.value.toJSNumber() : res.value;
        getServerCloudBalance().then(res => {
            console.log('服务器推送成功 云端余额更新==========================',res);
        });
        console.log('服务器推送成功==========================',res);
        payOk();
    });

    // 监听邀请好友成功事件
    setMsgHandler(ServerPushKey.EVENTINVITESUCCESS,(res) => {
        console.log('event_invite_success服务器推送邀请好友成功=====================',res);
        const invite = getStore('inviteUsers').invite_success || [];
        
        if (res.accId) {
            // const index = invite.indexOf(res.accId);
            // index === -1 && invite.push([res.accId,(new Date().getTime()),GENERATORTYPE.NOTICE_1]);
            let index = -1;
            invite.forEach((v,i) => {
                if (v[0] === res.accId) {
                    index = i;
                }
            });
            if (index === -1) {
                invite.push([res.accId,(new Date().getTime()),'invite']);  
            } 
            setStore('inviteUsers/invite_success',invite);
        }
  
    });

    // 监听兑换邀请码成功事件
    setMsgHandler(ServerPushKey.EVENTCONVERTINVITE,(res) => {
        console.log('event_convert_invite服务器推送兑换邀请码成功=====================',res);
        let invite = [];
        if (res.accId) {
            invite = [res.accId,(new Date().getTime()),'beInvited'];
        } 
        setStore('inviteUsers/convert_invite',invite);

    });

    // 监听邀请好友并成为真实用户事件
    setMsgHandler(ServerPushKey.EVENTINVITEREAL,(res) => {
        console.log('event_invite_real服务器推送邀请好友并成为真实用户===============',res);
        setStore('flags/invite_realUser',res.num);
    });

    // 监听余额变化事件
    setMsgHandler(ServerPushKey.ALTERBALANCEOK,async (res) => {
        console.log('alter_balance_ok服务器推送成功===========调用排名===============',res);
        await getServerCloudBalance();
        const wallet = getStore('wallet');
        const userInfo = getStore('user/info');
        // let popType = -1;           // 弹框类型 -1 无弹框 0 密码弹框   1 绑定手机弹框
        // debugger;
        // if (!wallet.setPsw) {
        //     const setPsw = getStore('flags').setPsw;
        //     if (!setPsw) {
        //         setStore('flags/setPsw',true);  // 防止多次弹窗
        //         popType = 0;
        //     }
            
        // } else if (!userInfo.phoneNumber) {
        //     const bindPhone = getStore('flags').bindPhone;
        //     if (!bindPhone) {
        //         setStore('flags/bindPhone',true);  // 防止多次弹窗
        //         popType = 1;
        //     }
            
        // }
        balanceChange(res);
    });

    // setMsgHandler('event_kt_alert',(res) => {
    //     console.log('event_kt_alert服务器推送成功==========================',res);
    // });
};

initPush();
// ===================================================== 本地
