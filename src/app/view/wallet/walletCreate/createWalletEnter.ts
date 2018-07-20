/**
 * create a wallet
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { BTCWallet } from '../../../core/btc/wallet';
import { GaiaWallet } from '../../../core/eth/wallet';
import { GlobalWallet } from '../../../core/globalWallet';
// tslint:disable-next-line:max-line-length
import { getAvatarRandom, getWalletPswStrength, pswEqualed, walletCountAvailable, walletNameAvailable, walletPswAvailable } from '../../../utils/account';
import { defalutShowCurrencys, walletNumLimit } from '../../../utils/constants';
import { encrypt, getDefaultAddr, getLocalStorage, setLocalStorage } from '../../../utils/tools';
import { Addr, CurrencyRecord, Wallet } from '../../interface';

export class CreateWalletEnter extends Widget {
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
        };
    }
    public toCreateWallet() {
        this.ok && this.ok();
        popNew('app-view-wallet-walletCreate-walletCreate');
    }
    public backPrePage() {
        this.ok && this.ok();
    }
    public toCreateByImg() {
        this.ok && this.ok();
        popNew('app-view-wallet-walletCreate-createByImg-createByImg');
    }
    public importByImtokenClicked() {
        this.ok && this.ok();
        popNew('app-view-wallet-walletImport-walletImport',{ title:'导入imtoken' });
    }
    public walletImportClicked() {
        this.ok && this.ok();
        popNew('app-view-wallet-walletImport-walletImport',{ title:'导入助记词' });
    }
    public importByFairblockClicked() {
        this.ok && this.ok();
        popNew('app-view-wallet-walletImport-importByFairBlock');
    }

}
