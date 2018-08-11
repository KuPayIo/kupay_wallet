/**
 * 
 */
import { SendChatMessage } from '../../pi/browser/sendMessage';
import { Widget } from '../../pi/widget/widget';
import { getProxy } from '../net/pull';
import { doChat } from '../store/conMgr';
export class App extends Widget {
    public old: any = {};
    public create() {
        super.create();
        this.init();
    }

    public init(): void {
        const isActive = 0;
        this.old[isActive] = true;
        this.state = {
            type: 2, // 用户可以单击选项，来切换卡片。支持3种模式，惰性加载0-隐藏显示切换，切换采用加载1-销毁模式，一次性加载2-隐藏显示切换。
            isActive,
            old: this.old,
            tabBarList: [{
                text: '钱包',
                icon: 'wallet_icon.png',
                iconActive: 'wallet_icon_active.png',
                components: 'app-view-wallet-home'
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
                components: 'app-view-mine-home'
            }]

        };
    }
    public async tabBarChangeListener(event: any, index: number) {
        if (this.state.isActive === index) return;
        // 点击的是聊天则调用接口打开聊天，不进行组件切换
        if (this.state.tabBarList[index].name === 'chat') {
            // todo 测试代码，需要移除
            // await doChat();

            this.setProxy().then(this.sendMessage);

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
        await doChat();

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
                } else {
                    reject('no support');
                }
            });
        });

    }
}