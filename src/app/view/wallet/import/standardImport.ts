/**
 * standard import bu Mnemonic
 */
import { getLang } from '../../../../pi/util/lang';
import { Widget } from '../../../../pi/widget/widget';
import { callisValidMnemonic } from '../../../middleLayer/wrap';
import { lang } from '../../../publicLib/config';
import { popNew3, popNewMessage } from '../../../utils/tools';
import { CreateWalletType } from '../../../viewLogic/localWallet';
import { forelet,WIDGET_NAME } from './home';

export class StandardImport extends Widget {
    public cancel: () => void;
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
    public async nextClick(e:any) {
        if (this.props.mnemonic.length <= 0) {
            popNewMessage(this.language.tips);

            return;
        }
        const valid = await callisValidMnemonic(lang,this.props.mnemonic);
        if (!valid) {
            popNewMessage(this.language.invalidMnemonicTips);

            return;
        }
        const w:any = forelet.getWidget(WIDGET_NAME);
        if (w) {
            w.ok && w.ok();
        }
        popNew3('app-view-wallet-create-createWallet',{ itype:CreateWalletType.StrandarImport,mnemonic:this.props.mnemonic },() => {
            this.ok && this.ok();
        });
    }

    public backPrePage() {
        this.cancel && this.cancel();
    }

    public whatIsMnemonicClick() {
        popNew3('app-view-wallet-import-mnemonicDesc');
    }

    public imageImportClick() {
        popNew3('app-view-wallet-import-imageImport',{},() => {
            this.ok && this.ok();
        });
    }
    public fragmentImportClick() {
        popNew3('app-view-wallet-import-fragmentImport',{},() => {
            this.ok && this.ok();
        });
    }
}