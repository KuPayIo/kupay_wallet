/**
 * mine home page
 */
import { ShareToPlatforms } from '../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../pi/ui/root';
import { notify } from '../../../pi/widget/event';
import { Widget } from '../../../pi/widget/widget';
import { GlobalWallet } from '../../core/globalWallet';
import { getCurrentWallet, getLocalStorage } from '../../utils/tools';

export class Home extends Widget {
    public stp: ShareToPlatforms;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init() {
        // 获取钱包显示头像
        const wallets = getLocalStorage('wallets');
        const wallet = getCurrentWallet(wallets);
        const gwlt = GlobalWallet.fromJSON(wallet.gwlt);
        const avatar = wallet.avatar;
        const walletName = gwlt.nickName;
        this.state = {
            avatar,
            walletName,
            hasNews: true,
            mineList: [{
                icon: 'icon_mine_wallet.png',
                text: '管理钱包',
                components: 'app-view-mine-walletManagement-walletList'
            },/*  {
                icon: 'icon_mine_annal.png',
                text: '交易记录',
                components: 'app-view-mine-transaction-record'
            }, */
            {
                icon: 'icon_mine_address.png',
                text: '常用地址',
                components: 'app-view-mine-addressManage-addressManage'
            },
            // {
            //     icon: 'icon_mine_Language.png',
            //     text: '语言设置',
            //     components: 'app-view-mine-languageAndcoinset-language'
            // }, 
            {
                icon: 'icon_mine_Language.png',
                text: '锁屏密码',
                components: 'app-view-mine-lockScreen-lockScreenSetting'
            },
            // {
            //     icon: 'icon_mine_money.png',
            //     text: '货币设置',
            //     components: 'app-view-mine-languageAndcoinset-coinset'
            // }, 
            {
                icon: 'icon_mine_problem.png',
                text: '常见问题',
                components: 'app-view-mine-FAQ-FAQ'
            },
            {
                icon: 'icon_mine_about.png',
                text: '关于我们',
                components: 'app-view-mine-aboutus-aboutus'
            }
                // ,
                //  {
                //     icon: 'icon_mine_share.png',
                //     text: '分享下载链接',
                //     components: 'app-view-financialManagement-fund-share'
                // }
            ]
        };
    }

    public itemClick(e: any, index: number) {
        if (index <= 2) {
            const wallets = getLocalStorage('wallets');
            const wallet = getCurrentWallet(wallets);
            if (!wallets || wallets.walletList.length === 0) {
                popNew('app-components-message-message', { itype: 'error', content: '请创建钱包', center: true });

                return;
            }
            if (!wallet) {
                popNew('app-view-wallet-switchWallet-switchWallet');

                return;
            }
        }
        if (index === this.state.mineList.length - 1) {
            this.share();

            return;
        }
        popNew(this.state.mineList[index].components, {}, (home) => {
            if (home) {
                notify(this.tree, 'ev-change-tab', { index: 0 });
            }

        });
    }

    public goNotice(event: any) {
        popNew('app-view-messageList-messageList', { hasNews: this.state.hasNews }, (r) => {
            if (r) {
                this.state.hasNews = false;
                this.paint();
            }
        });
    }

    public share() {
        popNew('app-components-share-share', { text: 'This is a test QRCode', shareType: ShareToPlatforms.TYPE_IMG }, (result) => {
            alert(result);
        }, (result) => {
            alert(result);
        });
    }
    public walletManagementClick() {
        popNew('app-view-mine-walletManagement-walletManagement');
    }
    public backupClick() {
        alert('aa');
    }
}