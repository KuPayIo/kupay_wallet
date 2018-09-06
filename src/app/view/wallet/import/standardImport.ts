/**
 * standard import bu Mnemonic
 */
import { popNew } from '../../../../pi/ui/root';
import { notify } from '../../../../pi/widget/event';
import { Widget } from '../../../../pi/widget/widget';
import { importWalletByMnemonic } from '../../../logic/localWallet';
import { CreateWalletType } from '../../../store/interface';
import { pswEqualed } from '../../../utils/account';
import { forelet,WIDGET_NAME } from './home';

export class StandardImport extends Widget {
    public ok: () => void;
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            mnemonic:'',
            psw:'',
            pswConfirm:''
        };
    }
    public inputChange(r:any) {
        const mnemonic = r.value;
        this.state.mnemonic = mnemonic;
    }
    public nextClick(e:any) {
        if (this.state.mnemonic.length <= 0) {
            popNew('app-components-message-message', { content: '请输入助记词' });

            return;
        }
        const w:any = forelet.getWidget(WIDGET_NAME);
        if (w) {
            w.ok && w.ok();
        }
        // tslint:disable-next-line:max-line-length
        popNew('app-view-wallet-create-createWallet',{ itype:CreateWalletType.StrandarImport,mnemonic:this.state.mnemonic });
    }
}