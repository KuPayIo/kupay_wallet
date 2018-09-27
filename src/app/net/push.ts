import { setMsgHandler } from '../../pi/net/ui/con_mgr';
import { popNewMessage } from '../utils/tools';
import { getCloudBalance } from './pull';

/**
 * 后端主动推消息给后端
 */
// ===================================================== 导入
// ===================================================== 导出
// ===================================================== 本地

// ===================================================== 立即执行

// 主动推送
export const initPush = () => {
    setMsgHandler('event_pay_ok',(res) => {
        popNewMessage('充值已到账');
        const value = res.value.toJSNumber ? res.value.toJSNumber() : res.value;
        getCloudBalance().then(res => {
            console.log('服务器推送成功 云端余额更新==========================',res);
        });
        console.log('服务器推送成功==========================',res);
    });
};
