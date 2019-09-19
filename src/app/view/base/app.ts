/**
 * 首页
 */
// ================================ 导入
import { register as ChatRegister } from '../../../chat/client/app/data/store';
import { register as earnRegister } from '../../../earn/client/app/store/memstore';
import { setLang } from '../../../pi/util/lang';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { getModulConfig } from '../../modulConfig';
import { register, getStore } from '../../store/memstore';
import { checkPopPhoneTips, rippleShow } from '../../utils/tools';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
declare var pi_modules: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class App extends Widget {
    public props:any;
    public old: any = {};
    public create() {
        super.create();
        this.init();
        this.props.showGameImg = true;
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
                }
                // ,{
                //     modulName: 'APP_CHAT',
                //     text: { zh_Hans:'聊',zh_Hant:'聊',en:'' },
                //     icon: 'chat.png',
                //     iconActive: 'chat_active.png',
                //     components: 'chat-client-app-view-chat-contact'
                // },{
                //     modulName: 'APP_EARN',
                //     text: { zh_Hans:'赚',zh_Hant:'賺',en:'' },
                //     icon: 'earn.png',
                //     iconActive: 'earn_active.png',
                //     components: 'earn-client-app-view-home-home1'
                // },{
                //     modulName: 'APP_WALLET',
                //     text: { zh_Hans:'钱',zh_Hant:'錢',en:'' },
                //     icon: 'wallet.png',
                //     iconActive: 'wallet_active.png',
                //     components: 'app-view-wallet-home-home'
                // }
            ],
            tabBarAnimateClasss:''
        };
        
        this.props.tabBarList = this.props.tabBarList.filter(item => {
            return getModulConfig(item.modulName);
        });
    }

    public tabBarChangeListener(event: any, index: number) {
        rippleShow(event);
        const identfy = this.props.tabBarList[index].modulName;
        if (this.props.isActive === identfy) return;
        this.props.isActive = identfy;
        this.old[identfy] = true;
        this.paint();
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
        this.props.showGameImg = true;  // 创建钱包成功后展示游戏大图
        this.props.isActive = 'APP_PLAY';
        this.paint();
    }

    // 切换聊天图标小红点
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

    // 关闭游戏大图
    public closeGameImg(){
        setTimeout(() => {
            this.props.showGameImg = false;
            this.paint();    
        }, 1000);
    }

}

// ===================================================== 本地

// ===================================================== 立即执行

register('flags/level_3_page_loaded', (loaded: boolean) => {
    const dataCenter = pi_modules.commonjs.exports.relativeGet('app/logic/dataCenter').exports.dataCenter;
    dataCenter.init();
    // checkPopPhoneTips();  // 检测是否绑定了手机号
    if (localStorage.getItem('kickOffline')) {
        const kickOffline = pi_modules.commonjs.exports.relativeGet('app/net/login').exports.kickOffline;
        localStorage.removeItem('kickOffline');
        kickOffline();  // 踢人下线提示
    }
});

// 语言配置
register('setting/language',(r) => {
    setLang(r);
});

// 创建钱包成功
register('flags/createWallet',(createWallet:boolean) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    w && w.switchToPlay();
});

// 进入游戏后关闭游戏大图
register('flags/EnterGame',()=>{
    const w: any = forelet.getWidget(WIDGET_NAME);
    w && w.closeGameImg(); 
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