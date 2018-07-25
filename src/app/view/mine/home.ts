/**
 * mine home page
 */
import { ShareToPlatforms } from '../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../pi/ui/root';
import { notify } from '../../../pi/widget/event';
import { Widget } from '../../../pi/widget/widget';
import { GlobalWallet } from '../../core/globalWallet';
import { register } from '../../store/store';
import { getCurrentWallet, getLocalStorage, getMnemonic } from '../../utils/tools';

export class Home extends Widget {
    public stp: any;
    constructor() {
        super();
    }
    public create() {
        super.create();
        register('wallets', this.registerWalletsFun);
        this.init();
    }
    public init() {
        // 获取钱包显示头像
        const wallets = getLocalStorage('wallets');
        const wallet = getCurrentWallet(wallets);
        let gwlt = null;
        let avatar = null;
        let walletName = null;
        let mnemonicBackup = null;
        if (wallet) {
            gwlt = GlobalWallet.fromJSON(wallet.gwlt);
            avatar = wallet.avatar;
            walletName = gwlt.nickName;
            mnemonicBackup = gwlt.mnemonicBackup;
        }
        
        this.stp = new ShareToPlatforms();
        this.stp.init();
        this.state = {
            wallets,
            wallet,
            avatar,
            walletName,
            mnemonicBackup,
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
        this.stp.shareQRCode({
            success: (result) => {
                alert(result);
            },
            fail: (result) => {
                alert(result);
            }, content: 'This is a test QRCode'
        });
    }
    public walletManagementClick() {
        if (!this.state.wallet || this.state.wallets.walletList.length === 0) {
            popNew('app-components-message-message', { itype: 'error', content: '请创建钱包', center: true });

            return;
        }
        popNew('app-view-mine-walletManagement-walletManagement',{ walletId:this.state.wallet.walletId });
    }
    public backupClick() {
        if (!this.state.wallet || this.state.wallets.walletList.length === 0) {
            popNew('app-components-message-message', { itype: 'error', content: '请创建钱包', center: true });

            return;
        }
        popNew('app-components-message-messageboxPrompt', { title: '输入密码', content: '', inputType: 'password' }, async (r) => {
            const wallets = getLocalStorage('wallets');
            const wallet = getCurrentWallet(wallets);
            const close = popNew('pi-components-loading-loading', { text: '导出中...' });
            try {
                const mnemonic = await getMnemonic(wallet, r);
                if (mnemonic) {
                    popNew('app-view-wallet-backupWallet-backupMnemonicWord', { mnemonic, passwd: r ,walletId:wallet.walletId });
                } else {
                    popNew('app-components-message-message', { itype: 'error', content: '密码错误,请重新输入', center: true });
                }
            } catch (error) {
                console.log(error);
                popNew('app-components-message-message', { itype: 'error', content: '密码错误,请重新输入111', center: true });
            }

            close.callback(close.widget);
        });
    }
    
    private registerWalletsFun = () => {
        this.init();
        this.paint();
    }
}