/**
 * standard import bu Mnemonic
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { getLanguage } from '../../../utils/tools';
import { forelet,WIDGET_NAME } from './home';
import { lang } from '../../../utils/constants';
import { isValidMnemonic } from '../../../core/genmnemonic';
import { CreateWalletType } from '../../../logic/localWallet';

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
            pswConfirm:'',
            cfgData:getLanguage(this)
        };
    }
    public inputChange(r:any) {
        const mnemonic = r.value;
        this.state.mnemonic = mnemonic;
    }
    public nextClick(e:any) {
        if (this.state.mnemonic.length <= 0) {
            popNew('app-components1-message-message', { content: this.state.cfgData.tips });

            return;
        }
        if(!isValidMnemonic(lang,this.state.mnemonic)){
            popNew('app-components1-message-message', { content: this.state.cfgData.invalidMnemonicTips });

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