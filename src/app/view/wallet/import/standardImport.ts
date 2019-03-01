/**
 * standard import bu Mnemonic
 */
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Widget } from '../../../../pi/widget/widget';
import { isValidMnemonic } from '../../../core/genmnemonic';
import { CreateWalletType } from '../../../logic/localWallet';
import { lang } from '../../../utils/constants';
import { forelet,WIDGET_NAME } from './home';

export class StandardImport extends Widget {
    public ok: () => void;
    public language:any;
    public setProps(props:any,oldProps:any) {
        this.language = this.config.value[getLang()];
        this.props = {
            ...props,
            mnemonic:'',
            psw:'',
            pswConfirm:''
        };
        super.setProps(this.props,oldProps);
    }
    public inputChange(r:any) {
        const mnemonic = r.value;
        this.props.mnemonic = mnemonic;
    }
    public nextClick(e:any) {
        if (this.props.mnemonic.length <= 0) {
            popNew('app-components1-message-message', { content: this.language.tips });

            return;
        }
        if (!isValidMnemonic(lang,this.props.mnemonic)) {
            popNew('app-components1-message-message', { content: this.language.invalidMnemonicTips });

            return;
        }
        const w:any = forelet.getWidget(WIDGET_NAME);
        if (w) {
            w.ok && w.ok();
        }
        // tslint:disable-next-line:max-line-length
        popNew('app-view-wallet-create-createWallet',{ itype:CreateWalletType.StrandarImport,mnemonic:this.props.mnemonic },() => {
            this.ok && this.ok();
        });
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    public whatIsMnemonicClick() {
        popNew('app-view-wallet-import-mnemonicDesc');
    }

    public imageImportClick() {
        popNew('app-view-wallet-import-imageImport',{},() => {
            this.ok && this.ok();
        });
    }
    public fragmentImportClick() {
        popNew('app-view-wallet-import-fragmentImport',{},() => {
            this.ok && this.ok();
        });
    }

    public phoneImportClick() {
        popNew('app-view-wallet-import-phoneImport',{},() => {
            this.ok && this.ok();
        });
    }
}