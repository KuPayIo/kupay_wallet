/**
 * changePSW
 */
// =============================================导入
import { Widget } from '../../../../pi/widget/widget';
import { find, updateStore } from '../../../store/store';
import { pswEqualed, walletPswAvailable } from '../../../utils/account';
import { popNew } from '../../../../pi/ui/root';
import { GlobalWallet } from '../../../core/globalWallet';
// ================================================导出
export class ChangePSW extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }

    public create() {
        super.create()
        this.state={
            oldPassword:'',
            newPassword:'',
            rePassword:''
        }
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    public oldPswChange(e: any) {
        this.state.newPassword = e.value;
    }
    public newPswChange(e: any) {
        this.state.newPassword = e.value;
    }
    public rePswChange(e: any) {
        this.state.rePassword = e.value;
    }

    /**
     * 点击确认按钮
     */
    public async btnClicked() {
        const newPassword = this.state.newPassword;
        const rePassword = this.state.rePassword;
        const walletList = find('walletList');
        const wallet = find('curWallet');
        if (!newPassword || !rePassword) {
            return;
        }
        // 判断两次输入的密码是否相同
        if (!pswEqualed(newPassword, rePassword)) {
            popNew('app-components-message-messagebox', { itype: 'alert', title: '提示！', content: '两次输入的密码不一致！' });

            return;
        }
        if (!walletPswAvailable(newPassword)) {
            popNew('app-components-message-messagebox', { itype: 'alert', title: '提示！', content: '密码不符合规则！密码至少8位字符，可包含英文、数字、特殊字符！' });

            return;
        }
        // 验证全部通过，开始设置新密码
        const loading = popNew('app-components_level_1-loading-loading', { text: '修改中...' });
        const gwlt = GlobalWallet.fromJSON(wallet.gwlt);
        await gwlt.passwordChange(this.state.oldPassword, newPassword, wallet.walletId);
        wallet.gwlt = gwlt.toJSON();
        updateStore('walletList', walletList);
        loading.callback(loading.widget);
        this.backPrePage();
    }

}
