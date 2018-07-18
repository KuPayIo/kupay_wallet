/**
 * wallet backup
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { pswEqualed } from '../../../utils/account';
import { decrypt, getCurrentWallet, getLocalStorage } from '../../../utils/tools';

export class BackupWallet extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            mnemonic: ''
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }
    public backupWalletClick() {
        popNew('app-components-message-messagebox', { itype: 'prompt', title: '输入密码', content: '', inputType: 'password' }, (r) => {
            const wallets = getLocalStorage('wallets');
            const wallet = getCurrentWallet(wallets);
            const walletPsw = decrypt(wallet.walletPsw);
            if (pswEqualed(r, walletPsw)) {
                const close = popNew('pi-components-loading-loading', { text: '导出中...' });
                setTimeout(() => {
                    close.callback(close.widget);
                    this.ok && this.ok();
                    popNew('app-view-wallet-backupMnemonicWord-backupMnemonicWord');
                }, 500);
            } else {
                popNew('app-components-message-message', { itype: 'error', content: '密码错误,请重新输入', center: true });
            }
        });
    }

}