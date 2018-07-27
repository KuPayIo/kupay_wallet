/**
 * 
 */
import { SendChatMessage } from '../../pi/browser/sendMessage';
import { Widget } from '../../pi/widget/widget';
export class App extends Widget {
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init(): void {
        this.state = {
            tabBarList: [{
                text: '钱包',
                icon: 'wallet_icon.png',
                iconActive: 'wallet_icon_active.png',
                components: 'app-view-wallet-home'
            }, 
            {
                text: '云端',
                icon: 'remote_icon.png',
                iconActive: 'remote_icon_active.png',
                components: 'app-view-financialManagement-index-index'
            },
            {
                text: '',
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
            }],
            isActive: 0
        };
    }
    public tabBarChangeListener(event: any, index: number) {
        if (this.state.isActive === index) return;
        // 点击的是聊天则调用接口打开聊天，不进行组件切换
        if (index === 2) {
            this.setProxy();

            return;
        }
        this.state.isActive = index;
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
    public sendMessage() {
        const chat = new SendChatMessage();
        chat.init();
        chat.prepareChat({
            success: (result) => {
                alert('成功');
            },
            fail: (result) => {
                alert('失败');
            }
        });
    }

    /**
     * 设置代理
     */
    public setProxy() {
        const chat = new SendChatMessage();
        chat.init();
        chat.setProxy({
            success: (result) => {
                this.sendMessage();
            },
            fail: (result) => {
                alert('失败');
            }, proxyIp: '120.77.252.201', proxyPort: 1820, userName: '', password: ''
        });
    }
}