import { setBottomLayerReloginMsg, setMsgHandler } from '../../pi/net/ui/con_mgr';
import { backCall, backList, popNew } from '../../pi/ui/root';
import { CMD } from '../utils/constants';
import { getStaticLanguage, logoutAccount, logoutAccountDel, popNewMessage } from '../utils/tools';
import { kpt2kt } from '../utils/unitTools';
import { getServerCloudBalance } from './pull';

/**
 * 后端主动推消息给后端
 */
// ===================================================== 导入
// ===================================================== 导出
// ===================================================== 本地

// ===================================================== 立即执行

// 主动推送
export const initPush = () => {
    // 监听指令事件
    setMsgHandler('cmd',(res) => {
        console.log('强制下线==========================',res);
        setBottomLayerReloginMsg('','','');
        const cmd = res.cmd;
        if (cmd === CMD.FORCELOGOUT) {
            logoutAccount();
            
        } else if (cmd === CMD.FORCELOGOUTDEL) {
            logoutAccountDel();
        }
        
        popNew('app-components1-modalBox-modalBox',{
            sureText:{ zh_Hans:'重新登录',zh_Hant:'重新登錄',en:'' },
            cancelText:{ zh_Hans:'退出',zh_Hant:'退出',en:'' },
            title:{ zh_Hans:'下线通知',zh_Hant:'下線通知',en:'' },
            content:{ zh_Hans:'您的账户已被下线，如非本人操作，则助记词可能已泄露。',zh_Hant:'您的賬戶已被下線，如非本人操作，則助記詞可能已洩露。',en:'' }
        },() => {
            setTimeout(() => {
                for (let i = backList.length;i > 1;i--) {
                    backCall();
                }
                popNew('app-view-wallet-create-home');
            },100);
        },() => {
            setTimeout(() => {
                for (let i = backList.length;i > 1;i--) {
                    backCall();
                }
            },100);
        });
    });

    // 监听充值成功事件
    setMsgHandler('event_pay_ok',(res) => {
        popNewMessage(getStaticLanguage().transfer.rechargeTips);
        const value = res.value.toJSNumber ? res.value.toJSNumber() : res.value;
        getServerCloudBalance().then(res => {
            console.log('服务器推送成功 云端余额更新==========================',res);
        });
        console.log('服务器推送成功==========================',res);
    });

    // 监听余额变化事件
    // setMsgHandler('alter_balance_ok',(res) => {
        // if (res.coinType === CloudCurrencyType.KT) {
        //     popNew('app-view-earn-mining-addMineAlert',{ addNum:kpt2kt(res.num) });
        // }
    //     console.log('服务器推送成功==========================',res);
    // });

    // // 监听KT增加事件
    // setMsgHandler('event_kt_alert',(res) => {
    //     popNew('app-view-earn-mining-addMineAlert',{ addNum:kpt2kt(res.num),iconType:'KT' });
    //     console.log('服务器推送成功==========================',res);
    // });
};
