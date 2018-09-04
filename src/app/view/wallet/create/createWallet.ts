/**
 * create wallet
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { createWallet } from '../../../logic/localWallet';
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
            userProtocolReaded: false,
            walletPswAvailable:false,
            avatar:''
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
    public pswConfirmChange(r:any) {
        this.state.walletPswConfirm = r.value;
    }
    // 密码格式正确通知
    public pswSuccessChange(res:any) {
        this.state.walletPswAvailable = true;
        this.state.walletPsw = res.password;
    }
    public async createClick() {
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
            popNew('app-components-message-message', { content: '两次输入密码不一致' });

            return;
        }

        const close = popNew('app-components1-loading-loading', { text: '创建中...' });
        await createWallet(this.state.walletPsw,this.state.walletName,this.state.avatar);
        close.callback(close.widget);
        this.ok && this.ok();
        popNew('app-components-modalBox-modalBox',{ 
            title:'创建成功',
            content:'记得备份，如果忘记账户就找不回来了。',
            sureText:'备份',
            cancelText:'暂时不' 
        },() => {
            // popNew('app-view-wallet-create-createEnter');
        });
    }
}