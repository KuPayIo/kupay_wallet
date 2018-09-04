/**
 * create wallet
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { pswEqualed, walletNameAvailable } from '../../../utils/account';

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
            userProtocolReaded: false,
            walletPswAvailable:false
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }
    public walletNameChange(e: any) {
        this.state.walletName = e.value;
        this.paint();
    }
    public checkBoxClick(e: any) {
        this.state.userProtocolReaded = (e.newType === 'true' ? true : false);
        this.paint();
    }
    // 密码格式正确通知
    public pswSuccessChange() {
        this.state.walletPswAvailable = true;
    }
    public createClick() {
        if (!this.state.userProtocolReaded) {
            return;
        }
        if (!walletNameAvailable(this.state.walletName)) {
            popNew('app-components-message-message', { content: '请输入1-10位钱包名' });

            return;
        }
        if (!this.state.walletPswAvailable) {
            popNew('app-components-message-message', { content: '密码格式不正确' });

            return;
        }
        if (!pswEqualed(this.state.walletPsw, this.state.walletPswConfirm)) {

            return;
        }
    }
}