import { Widget } from '../../../pi/widget/widget';
import { touristLogin } from '../../net/login';
import { popNewMessage } from '../../utils/pureUtils';

/**
 * 登录注册
 */

export class Entrance extends Widget {
    public ok:() => void;
    // 游客登录
    public async touristLoginClick() {
        touristLogin().then(res => {
            popNewMessage('登录成功');
            this.ok && this.ok();
        }).catch (err => {
            popNewMessage ('登录失败');
        });
        console.log('游客登录');
    }
    
}