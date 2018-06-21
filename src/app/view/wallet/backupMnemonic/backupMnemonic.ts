/**
 * Mnemonic backup 
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { GlobalWallet } from '../../../core/globalWallet';
import { decrypt, getCurrentWallet, getLocalStorage } from '../../../utils/tools';

export class BackupMnemonic extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init() {
        const wallets = getLocalStorage('wallets');
        const wallet = getCurrentWallet(wallets);
        const gwlt = GlobalWallet.fromJSON(wallet.gwlt);
        const walletPsw = decrypt(wallet.walletPsw);
        const mnemonic = gwlt.exportMnemonic(walletPsw).split(' ');
        this.state = {
            mnemonic
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }
    public nextStepClick() {
        this.ok && this.ok();
        popNew('app-view-wallet-backupMnemonicConfirm-backupMnemonicConfirm');
    }
}