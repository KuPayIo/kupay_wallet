/**
 * standard import bu Mnemonic
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { forelet,WIDGET_NAME } from './home';
import { lang } from '../../../utils/constants';
import { isValidMnemonic } from '../../../core/genmnemonic';
import { CreateWalletType } from '../../../logic/localWallet';
import { getLang } from '../../../../pi/util/lang';

export class StandardImport extends Widget {
    public ok: () => void;
    public language:any;
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.language = this.config.value[getLang()];
        this.state = {
            mnemonic:'',
            psw:'',
            pswConfirm:'',
        };
    }
    public inputChange(r:any) {
        const mnemonic = r.value;
        this.state.mnemonic = mnemonic;
    }
    public nextClick(e:any) {
        if (this.state.mnemonic.length <= 0) {
            popNew('app-components1-message-message', { content: this.language.tips });

            return;
        }
        if(!isValidMnemonic(lang,this.state.mnemonic)){
            popNew('app-components1-message-message', { content: this.language.invalidMnemonicTips });

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