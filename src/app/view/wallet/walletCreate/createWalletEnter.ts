/**
 * create a wallet
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
// tslint:disable-next-line:max-line-length
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
