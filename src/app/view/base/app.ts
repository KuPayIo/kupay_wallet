/**
 * 首页
 */
// ================================ 导入
import { setLang, getLang } from '../../../pi/util/lang';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { applyAutoLogin, fetchBtcFees, fetchGasPrices, getRealUser, getServerCloudBalance, getUserInfoFromServer, setUserInfo } from '../../net/pull';
import { UserInfo } from '../../store/interface';
import { getStore, register } from '../../store/memstore';
import { getLanguage } from '../../utils/tools';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
declare var pi_modules: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class App extends Widget {
    public old: any = {};
    public language:any;
    public create() {
        super.create();
        this.init();
        this.setList();
    }

    public init(): void {
        const isActive = 'wallet';
        this.old[isActive] = true;
        this.language = this.config.value[getLang()];

        const loading = localStorage.getItem('level_2_page_loaded') ? false : true;
        localStorage.removeItem('level_2_page_loaded');

        this.state = {
            type: 2, // 用户可以单击选项，来切换卡片。支持3种模式，惰性加载0-隐藏显示切换，切换采用加载1-销毁模式，一次性加载2-隐藏显示切换。
            isActive,
            old: this.old,
            loading,
            allTabBar: {
                play: {
                    identfy: 'play',
                    text: {"zh_Hans":"玩","zh_Hant":"玩","en":""},
                    icon: 'play.png',
                    iconActive: 'play_active.png',
                    components: 'app-view-play-home-home'
                },
                chat: {
                    identfy: 'chat',
                    text: {"zh_Hans":"聊","zh_Hant":"聊","en":""},
                    icon: 'chat.png',
                    iconActive: 'chat_active.png',
                    components: 'app-view-chat-home-home'
                },
                earn: {
                    identfy: 'earn',
                    text: {"zh_Hans":"赚","zh_Hant":"賺","en":""},
                    icon: 'earn.png',
                    iconActive: 'earn_active.png',
                    components: 'app-view-earn-home-home'
                },
                wallet: {
                    identfy: 'wallet',
                    text: {"zh_Hans":"钱","zh_Hant":"錢","en":""},
                    icon: 'wallet.png',
                    iconActive: 'wallet_active.png',
                    components: 'app-view-wallet-home-home'
                }
            },

            tabBarCfg: ['earn', 'wallet'],
            tabBarList: [],
        };
    }

    public setList() {
        let resList = [];
        for (let item of this.state.tabBarCfg) {
            resList.push(this.state.allTabBar[item]);
        }   
        this.state.tabBarList = resList;
    }
    public closeLoading() {
        this.state.loading = false;
        this.paint();
    }
    public async tabBarChangeListener(event: any, index: number) {
        let identfy = this.state.tabBarList[index].identfy;
        if (this.state.isActive === identfy) return;
        this.state.isActive = identfy;
        this.old[identfy] = true;
        this.paint();
    }

}

// ===================================================== 本地
// ===================================================== 立即执行

register('flags/level_2_page_loaded', (loaded: boolean) => {
    const dataCenter = pi_modules.commonjs.exports.relativeGet('app/logic/dataCenter').exports.dataCenter;
    dataCenter.init();
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.closeLoading();
    } else { // 处理导航页过程中资源已经加载完毕
        localStorage.setItem('level_2_page_loaded', '1');
    }
});

// 用户信息变化
register('user/info', (userInfo: UserInfo) => {
    const isLogin = getStore('user/isLogin');
    if (isLogin && userInfo) {
        setUserInfo();
    }
});

// 登录状态成功
register('user/isLogin', (isLogin: boolean) => {
    if (isLogin) {
        // 余额
        getServerCloudBalance();

        // 获取真实用户
        getRealUser();
        // 用户基础信息
        getUserInfoFromServer(getStore('user/conUid'));

        const userInfo = getStore('user/info');
        const flags = getStore('flags');
        if (flags.created && userInfo) {
            setUserInfo();
        }
    }
});

// 获取随机数成功
register('user/conRandom',() => {
    // eth gasPrice
    fetchGasPrices();

     // btc fees
    fetchBtcFees();
});

// 语言配置
register('setting/language',(r) => {
    setLang(r);
});
