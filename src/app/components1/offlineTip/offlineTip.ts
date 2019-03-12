/**
 * 离线提示
 */
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { register } from '../../store/memstore';
import { getReconnectMod } from '../../utils/commonjsTools';
// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class OfflineTip extends Widget {
    public create() {
        super.create();
        this.state = {
            isLogin:true,
            reconnecting:false
        };
    }
    /**
     * 断线重连
     */
    public reConnect() {
        if (this.state.reconnecting) return;
        this.state.reconnecting = true;   // 正在连接
        forelet.paint(this.state);
        getReconnectMod().then(reconnectMod => {
            reconnectMod.manualReconnect();
        });
        
    }
}

// ===========================================================
// 钱包登录监听
register('user/allIsLogin',async (allIsLogin:boolean) => {
    const reconnectMod = await getReconnectMod();
    const state = {
        isLogin:reconnectMod.getAllIsLogin(),
        reconnecting:reconnectMod.isReconnecting()
    };
    forelet.paint(state);
});