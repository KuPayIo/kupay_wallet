/**
 * create a wallet
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
// ============================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class CreateEnter extends Widget {
    public ok: () => void;
    public backPrePage() {
        this.ok && this.ok();
    }
    public createByImgClick() {
        popNew('app-view-wallet-create-createWalletByImage');
    }
    public walletImportClicke() {
        popNew('app-view-wallet-import-home');
    }
    public createStandardClick() {
        popNew('app-view-wallet-create-createWallet');
    }

}
