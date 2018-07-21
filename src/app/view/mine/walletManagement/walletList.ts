/**
 * 钱包列表页面展示所有钱包
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { GlobalWallet } from '../../../core/globalWallet';
import { getCurrentWallet, getLocalStorage, getMnemonic } from '../../../utils/tools';

export class WalletList extends Widget {
    public ok: () => void;
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
        console.log('-------walletList---------');
        console.log(wallets);
        // const wallet = getCurrentWallet(wallets);
        const fromJSON = GlobalWallet.fromJSON;

        this.state = {
            wallets,
            fromJSON
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }

    public listItemClicked(walletId) {
        if (this.state.wallets.curWalletId === walletId) {
            popNew('app-view-mine-walletManagement-walletManagement');
        }
    }
    public backupClicked(walletId) {
        if (this.state.wallets.curWalletId === walletId) {
            popNew('app-components-message-messageboxPrompt', { title: '输入密码', content: '', inputType: 'password' }, async (r) => {
                const wallets = getLocalStorage('wallets');
                const wallet = getCurrentWallet(wallets);
                const close = popNew('pi-components-loading-loading', { text: '导出中...' });
                try {
                    const mnemonic = await getMnemonic(wallet, r);
                    if (mnemonic) {
                        popNew('app-view-wallet-backupWallet-backupMnemonicWord', { mnemonic, passwd: r });
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
    }
}