/**
 * create a wallet
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
export class CreateEnter extends Widget {
    public ok: () => void;
    public backPrePage() {
        this.ok && this.ok();
    }
    public createByImgClick() {
        popNew('app-view-wallet-walletCreate-createByImg-createByImg');
    }
    public walletImportClicke() {
        popNew('app-view-wallet-walletImport-walletImport',{ title:'导入助记词' });
    }
    public createStandardClick() {
        popNew('app-view-wallet-create-createWallet');
    }

}
