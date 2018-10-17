import { setMsgHandler, setConState, ConState } from '../../pi/net/ui/con_mgr';
import { getStaticLanguage, popNewMessage, logoutAccount, logoutAccountDel } from '../utils/tools';
import { getCloudBalance, getRandom } from './pull';
import { popNew } from '../../pi/ui/root';
import { CMD } from '../utils/constants';

/**
 * 后端主动推消息给后端
 */
// ===================================================== 导入
// ===================================================== 导出
// ===================================================== 本地

// ===================================================== 立即执行

// 主动推送
export const initPush = () => {
    //监听指令事件
    setMsgHandler('cmd',(res) => {
        console.log('强制下线==========================',res);
        setConState(ConState.noReconnect);
        const cmd = res.cmd;
        if(cmd === CMD.FORCELOGOUT){
            logoutAccount();
        }else if(cmd === CMD.FORCELOGOUTDEL){
            logoutAccountDel();
        }
        popNew('app-components1-modalBox-modalBox',{title:'强制下线',content:"您将强制下线"},()=>{
        },()=>{
        });
    });


    //监听充值成功事件
    setMsgHandler('event_pay_ok',(res) => {
        popNewMessage(getStaticLanguage().transfer.rechargeTips);
        const value = res.value.toJSNumber ? res.value.toJSNumber() : res.value;
        getCloudBalance().then(res => {
            console.log('服务器推送成功 云端余额更新==========================',res);
        });
        console.log('服务器推送成功==========================',res);
    });
};
