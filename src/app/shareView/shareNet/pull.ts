import { request } from '../../../pi/net/ui/con_mgr';
import { popNew } from '../../../pi/ui/root';

/**
 * 通用的异步通信
 */
export const requestAsync = async (msg: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        request(msg, (resp: any) => {
            if (resp.type) {
                console.log(`错误信息为${resp.type}`);
                reject(resp);
            } else if (resp.result !== 1) {
                let str;
                if (!str) {
                    switch (resp.result) {
                        case 600: str = '数据库错误'; break;
                        case 705: str = '红包余额必须大于1000';break;
                        case 711: str = '兑换码不存在'; break;
                        case 712: str = '兑换码已兑换'; break;
                        case 713: str = '兑换码已过期'; break;
                        case 714: str = '已兑换该红包'; break;
                        case 2010: str = '无法兑换自己的兑换码'; break;
                        case -1: str = '无效的兑换码'; break;
                        case -2: str = '你已经兑换了同类型的兑换码'; break;
                        default: str = '出错啦';
            
                    }
                }
            
                popNew('app-shareView-components-message', { itype: 'error', center: true, content: str });
                reject(resp);
            } else {
                resolve(resp);
            }
        });
    });
};