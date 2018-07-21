/**
 * change password
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { decrypt, getCurrentWallet, getLocalStorage } from '../../../utils/tools';
import { getWalletPswStrength, pswEqualed, walletPswAvailable } from '../../../utils/account';

export class ChangePassword extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }

    public init() {
        // const wallets = getLocalStorage('wallets');
        // const wallet = getCurrentWallet(wallets);
        // const walletPsw = decrypt(wallet.walletPsw);
        this.state = {
            style: {
                backgroundColor: '#FFF',
                fontSize: '24px',
                color: '#8E96AB',
                lineHeight: '33px',
                "border-bottom": "1px solid #c0c4cc"
            },
            oldPassword: '',
            newPassword: '',
            rePassword: '',
            strength: getWalletPswStrength('')
        };

    }

    public backPrePage() {
        this.ok && this.ok();
    }

    public btnClick() {
        if (!pswEqualed(this.state.walletPsw, this.state.inputValue)) {
            popNew('app-components-message-message', { itype: 'error', content: '密码错误', center: true });

            return;
        }
        popNew('app-view-mine-changePassword-changePassword2');
        this.ok && this.ok();
    }
    public oldPasswordChange(e: any) {
        this.state.oldPassword = e.value;
    }
    public newPasswordChange(e: any) {
        this.state.newPassword = e.value;
        this.state.strength = getWalletPswStrength(this.state.newPassword);
        this.paint();
    }
    public rePasswordChange(e: any) {
        this.state.rePassword = e.value;
    }

    public btnClicked() {
        let newPassword = this.state.newPassword;
        let oldPassword = this.state.oldPassword;
        let rePassword = this.state.rePassword;
        const wallets = getLocalStorage('wallets');
        const wallet = getCurrentWallet(wallets);
        const walletPsw = decrypt(wallet.walletPsw);
        if (!newPassword || !oldPassword || !rePassword) {
            return;
        }
        //判断两次输入的密码是否相同
        if (!pswEqualed(newPassword, rePassword)) {
            popNew("app-components-message-messagebox", { itype: "alert", title: "提示！", content: "两次输入的密码不一致！" });
            return;
        }
        if (!walletPswAvailable(newPassword)) {
            popNew("app-components-message-messagebox", { itype: "alert", title: "提示！", content: "密码不符合规则！密码至少8位字符，可包含英文、数字、特殊字符！" });
            return;
        }
        //判断旧密码是否正确
        if (!pswEqualed(walletPsw, oldPassword)) {
            popNew("app-components-message-messagebox", { itype: "alert", title: "提示！", content: "旧密码输入错误！" });
            return;
        }
        //验证全部通过，开始设置新密码

    }

}