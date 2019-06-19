/**
 * 离线提示
 */
import { getStore as chatGetStore, register as chatRegister } from '../../../chat/client/app/data/store';
import { chatManualReconnect } from '../../../chat/client/app/net/init';
import { earnManualReconnect } from '../../../earn/client/app/net/init';
import { getStore as earnGetStore, register as earnRegister } from '../../../earn/client/app/store/memstore';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { callWalletManualReconnect,getStoreData } from '../../middleLayer/wrap';
import { register } from '../../store/memstore';
// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export enum OfflienType {
    WALLET = 1,  // 钱包
    CHAT = 2,   // 聊天
    EARN = 3  // 活动
}
export class OfflineTip extends Widget {
    public create() {
        super.create();
         // 钱包login
        register('user/isLogin', (isLogin:boolean) => {
            this.updateDate(OfflienType.WALLET,isLogin);
        });

        // 赚钱login
        earnRegister('userInfo/isLogin', (isLogin:boolean) => {
            this.updateDate(OfflienType.EARN,isLogin);
        });

        // 聊天login
        chatRegister('isLogin', (isLogin:boolean) => {
            this.updateDate(OfflienType.CHAT,isLogin);
        });
    }
    public setProps(props:any,oldProps:any) {
        this.props = {
            ...props,
            isLogin:true,
            reconnecting:false
        };
        super.setProps(this.props,oldProps);
    }
    /**
     * 断线重连
     */
    public reConnect() {
        if (this.props.reconnecting) return;
        this.props.reconnecting = true;   // 正在连接
        const offlienType = this.props.offlienType;
        if (offlienType === OfflienType.WALLET) {  // 钱包重连
            callWalletManualReconnect();
        } else if (offlienType === OfflienType.CHAT) {  // 聊天重连
            getStoreData('user/isLogin').then(isLogin => {
                if (!isLogin) {
                    callWalletManualReconnect();
                }
            });
           
            if (!chatGetStore('isLogin')) {
                chatManualReconnect();
            }
        } else {   // 活动重连
            getStoreData('user/isLogin').then(isLogin => {
                if (!isLogin) {
                    callWalletManualReconnect();
                }
            });
            if (!earnGetStore('userInfo/isLogin')) {
                earnManualReconnect();
            }
        }
        this.paint();
    }

    public updateDate(offlienType:OfflienType,isLogin:boolean) {
        getStoreData('user/id').then(uid => {
            if (offlienType === OfflienType.WALLET || offlienType === this.props.offlienType) {  // 钱包重连
                this.props.isLogin = uid ?  isLogin : true;
                this.props.reconnecting = false;
                this.paint();
            }
        });
        
    }
}

// ===========================================================
