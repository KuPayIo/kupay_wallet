/**
 * create wallet
 */
import { Widget } from '../../../../pi/widget/widget';

export class CreateWallet extends Widget {
    public ok: () => void;
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            walletName: '李铁柱',
            walletPsw: '',
            walletPswConfirm: '',
            pswSame: true,
            userProtocolReaded: false
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }
    public walletNameChange(e: any) {
        this.state.walletName = e.value;
    }
}