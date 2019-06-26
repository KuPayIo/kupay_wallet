/**
 * 首页
 */
// ================================ 导入
import { register as ChatRegister } from '../../../chat/client/app/data/store';
import { register as earnRegister } from '../../../earn/client/app/store/memstore';
import { setLang } from '../../../pi/util/lang';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { getStoreData, registerStore } from '../../middleLayer/wrap';
import { changellyGetCurrencies } from '../../net/changellyPull';
import { getModulConfig } from '../../publicLib/modulConfig';
import { checkPopPhoneTips, rippleShow } from '../../utils/tools';
import { kickOffline } from '../../viewLogic/login';
import { setSourceLoadedCallbackList } from './main';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class App extends Widget {
    public props:any;
    public old: any = {};
    public create() {
        super.create();
        this.init();
    }

    public init(): void {
        const isActive = 'APP_WALLET';
        this.old[isActive] = true;
        this.props = {
            type: 2, // 用户可以单击选项，来切换卡片。支持3种模式，惰性加载0-隐藏显示切换，切换采用加载1-销毁模式，一次性加载2-隐藏显示切换。
            isActive:'APP_PLAY',
            old: this.old,
            tabBarList: [
                {
                    modulName: 'APP_PLAY',
                    text: { zh_Hans:'玩',zh_Hant:'玩',en:'' },
                    icon: 'play.png',
                    iconActive: 'play_active.png',
                    components: 'app-view-play-home-home'
                },{
                    modulName: 'APP_CHAT',
                    text: { zh_Hans:'聊',zh_Hant:'聊',en:'' },
                    icon: 'chat.png',
                    iconActive: 'chat_active.png',
                    components: 'chat-client-app-view-chat-contact'
                },{
                    modulName: 'APP_EARN',
                    text: { zh_Hans:'赚',zh_Hant:'賺',en:'' },
                    icon: 'earn.png',
                    iconActive: 'earn_active.png',
                    components: 'earn-client-app-view-home-home1'
                },{
                    modulName: 'APP_WALLET',
                    text: { zh_Hans:'钱',zh_Hant:'錢',en:'' },
                    icon: 'wallet.png',
                    iconActive: 'wallet_active.png',
                    components: 'app-view-wallet-home-home'
                }
            ],
            tabBarAnimateClasss:''
        };
        
        this.props.tabBarList = this.props.tabBarList.filter(item => {
            return getModulConfig(item.modulName);
        });
        // 币币兑换可用货币获取
        changellyGetCurrencies();
    }

    public tabBarChangeListener(event: any, index: number) {
        rippleShow(event);
        const identfy = this.props.tabBarList[index].modulName;
        if (this.props.isActive === identfy) return;
        this.props.isActive = identfy;
        this.old[identfy] = true;
        this.paint();
        changellyGetCurrencies();
    }

    public switchToEarn() {
        this.props.isActive = 'APP_EARN';
        this.paint();
    }

    public switchToChat() {
        this.props.isActive = 'APP_CHAT';
        this.paint();
    }

    public switchToPlay() {
        this.props.isActive = 'APP_PLAY';
        this.paint();
    }

    public changeChatIcon(fg:boolean) {
        if (fg) {
            this.props.tabBarList[1].iconActive = 'chat_active_unRead.png';
            this.props.tabBarList[1].icon = 'chat_unRead.png';
        } else {
            this.props.tabBarList[1].iconActive = 'chat_active.png';
            this.props.tabBarList[1].icon = 'chat.png';
        }
        this.paint();
    }
}

// ===================================================== 本地

// ===================================================== 立即执行

setSourceLoadedCallbackList(() => {
    checkPopPhoneTips();
    let res:any = localStorage.getItem('kickOffline');
    if (res) {
        res = JSON.parse(res);
        localStorage.removeItem('kickOffline');
        kickOffline(res.secretHash,res.phone,res.code,res.num);  // 踢人下线提示
    }
});

// localStorage key
export const SettingLanguage = 'language';

// 语言配置
registerStore('setting/language',(r) => {
    localStorage.setItem(SettingLanguage,r);
    setLang(r);
});

// 创建钱包成功
registerStore('flags/createWallet',(createWallet:boolean) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    w && w.switchToPlay();
});

// 监听活动页面
earnRegister('flags/earnHomeHidden',(earnHomeHidden:boolean) => {
    const w = forelet.getWidget(WIDGET_NAME);
    if (earnHomeHidden) {
        w.props.tabBarAnimateClasss = 'put-out-down';
    } else {
        w.props.tabBarAnimateClasss = 'reset-put-out';
    }
    w.paint();
});

// 监听聊天是否有未读消息
ChatRegister('flags/unReadFg',(fg) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    w && w.changeChatIcon(fg);
});

export const gotoChat = () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    w && w.switchToChat();
};

export const gotoEarn = () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    w && w.switchToEarn();
};