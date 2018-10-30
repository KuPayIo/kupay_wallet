import { closeCon, setMsgHandler } from '../../pi/net/ui/con_mgr';
import { backCall, backList, popNew } from '../../pi/ui/root';
import { CMD } from '../utils/constants';
import { getStaticLanguage, logoutAccount, logoutAccountDel, popNewMessage } from '../utils/tools';
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
        // 手动关闭可以阻止重新连接
        closeCon();
        const cmd = res.cmd;
        if (cmd === CMD.FORCELOGOUT) {
            logoutAccount();
        } else if (cmd === CMD.FORCELOGOUTDEL) {
            logoutAccountDel();
        }
        popNew('app-components1-modalBox-modalBox',{
            sureText:'重新登录',
            cancelText:'退出',
            title:'下线通知',
            content:'您的账户已被下线，如非本人操作，则助记词可能已泄露。'
        },() => {
            popNew('app-view-wallet-create-home');
        },() => {
            // console.log();
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
};
