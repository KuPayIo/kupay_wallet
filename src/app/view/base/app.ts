/**
 * 首页
 */
// ================================ 导入
import { SendChatMessage } from '../../../pi/browser/sendMessage';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { doChat, getProxy } from '../../net/pull';
import { register } from '../../store/store';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
declare var pi_modules : any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class App extends Widget {
    public old: any = {};
    public create() {
        super.create();
        this.init();
    }

    public init(): void {
        const isActive = 0;
        this.old[isActive] = true;
        const loading = localStorage.getItem('level_3_page_loaded') ? false : true;
        localStorage.removeItem('level_3_page_loaded');
        this.state = {
            type: 2, // 用户可以单击选项，来切换卡片。支持3种模式，惰性加载0-隐藏显示切换，切换采用加载1-销毁模式，一次性加载2-隐藏显示切换。
            isActive,
            old: this.old,
            loading,
            tabBarList: [{
                text: '钱包',
                icon: 'wallet_icon.png',
                iconActive: 'wallet_icon_active.png',
                components: 'app-view-wallet-home-home'
            },
            {
                text: '云端',
                name: 'cloud',
                icon: 'remote_icon.png',
                iconActive: 'remote_icon_active.png',
                components: 'app-view-cloud-home-home'
            },
            {
                text: '',
                name: 'chat',
                icon: 'chatIcon.png',
                iconActive: 'chatIcon.png',
                components: ''
                // components: 'app-view-financialManagement-home'
            },
            {
                text: '理财',
                icon: 'financialManagement_icon.png',
                iconActive: 'financialManagement_icon_active.png',
                components: 'app-view-financialManagement-index-index'
                // components: 'app-view-financialManagement-home'
            },
            // {
            //     text: '交易所',
            //     icon: 'exchange_icon.png',
            //     iconActive: 'exchange_icon_active.png',
            //     components: 'app-view-exchange-home'
            // }, {
            //     text: '应用',
            //     icon: 'application_icon.png',
            //     iconActive: 'application_icon_active.png',
            //     components: 'app-view-application-home'
            // }, 
            {
                text: '我的',
                icon: 'mine_icon.png',  
                iconActive: 'mine_icon_active.png',
                components: 'app-view-mine-home-home'
            }]

        };
    }
    public closeLoading() {
        this.state.loading = false;
        this.paint();
    }
    public async tabBarChangeListener(event: any, index: number) {
        if (this.state.isActive === index) return;
        // 点击的是聊天则调用接口打开聊天，不进行组件切换
        if (this.state.tabBarList[index].name === 'chat') {
            this.openChat();

            return;
        }
        // if (this.state.tabBarList[index].name === 'cloud') {
        //     const walletList = find('walletList');
        //     if (!walletList || walletList.length === 0) {
        //         popNew('app-components-message-message', { itype: 'error', content: '请创建钱包', center: true });

        //         return;
        //     }
        // }
        this.state.isActive = index;
        this.old[index] = true;
        this.paint();
    }

    public tabChangeTo(e: any) {
        const index = e.index;
        if (this.state.isActive === index) return;
        this.state.isActive = index;
        this.paint();
    }

    /**
     * 打开聊天界面
     */
    public async sendMessage() {
        // todo 进入聊天界面时，标记聊天任务完成
        doChat();

        const chat = new SendChatMessage();
        chat.init();

        return new Promise((resolve, reject) => {
            chat.prepareChat({
                success: (result) => {
                    resolve(result);
                },
                fail: (result) => {
                    reject(result);
                }
            });
        });

    }

    /**
     * 设置代理
     */
    public setProxy() {
        const chat = new SendChatMessage();
        chat.init();

        // 这里需要向服务器通信获取代理地址，且区分国内外的情况
        return new Promise((resolve, reject) => {
            getProxy().then((r) => {
                if (r.result !== 1) {
                    reject(r.result);

                    return;
                }
                const proxy = JSON.parse(r.proxy);
                if (proxy.protocol === 'socks5') {
                    chat.setProxy({
                        success: (result) => { resolve(result); },
                        fail: (result) => { reject(result); },
                        proxyIp: proxy.ip, proxyPort: proxy.prot, userName: '', password: ''
                    });
                    chat.setIosProxy({
                        success: (result) => { resolve(result); },
                        fail: (result) => { reject(result); },
                        proxyIp: '47.75.210.96', proxyPort: 1821, userName: '', password: '',secret:'feb7ebe6923489c73f4405c0a3927a7a'
                    });
                } else {
                    reject('no support');
                }
            });
        });

    }

    /**
     * 执行打开聊天界面
     */
    public openChat() {
        this.setProxy().then(this.sendMessage);
    }
}

// ===================================================== 本地
// ===================================================== 立即执行

/**
 * 矿山增加项目进入聊天页面和理财页面
 */
register('mineItemJump',(arg) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        if (arg === 'toChat') {
            w.openChat();
        }
        if (arg === 'buyFinancial') {
            w.tabBarChangeListener('',3);
        }
    }
});
register('level_2_page_loaded',(loaded:boolean) => {
    const dataCenter = pi_modules.commonjs.exports.relativeGet('app/logic/dataCenter').exports.dataCenter;
    dataCenter.init();
});

register('level_3_page_loaded',(loaded:boolean) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.closeLoading();
    } else { // 处理导航页过程中资源已经加载完毕
        localStorage.setItem('level_3_page_loaded','1');
    }
});