/**
 * 离线提示
 */
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { getAllIsLogin, isReconnecting, manualReconnect } from '../../net/reconnect';
import { register } from '../../store/memstore';
// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class OfflineTip extends Widget {
    public create() {
        super.create();
        this.state = {
            isLogin:getAllIsLogin(),
            reconnecting:false
        };
    }
    /**
     * 断线重连
     */
    public reConnect() {
        if (this.state.reconnecting) return;
        this.state.reconnecting = true;   // 正在连接
        console.log('reconnect');
        forelet.paint(this.state);
        
        manualReconnect();
    }
}

// ===========================================================
// 钱包登录监听
register('user/allIsLogin',(allIsLogin:boolean) => {
    const state = {
        isLogin:getAllIsLogin(),
        reconnecting:isReconnecting()
    };
    forelet.paint(state);
});