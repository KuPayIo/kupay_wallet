/**
 * changePSW
 */
// =============================================导入
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { GlobalWallet } from '../../../core/globalWallet';
import { find } from '../../../store/memstore';
import { pswEqualed } from '../../../utils/account';
import { getLanguage } from '../../../utils/tools';
import { VerifyIdentidy } from '../../../utils/walletTools';
// ================================================导出
export class ChangePSW extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }

    public create() {
        super.create();
        this.state = {
            oldPassword:'',
            newPassword:'',
            rePassword:'',
            cfgData:getLanguage(this),
            pswEqualed:false,
            pswAvailable:false
        };
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    public oldPswChange(e: any) {
        this.state.oldPassword = e.value;
    }
    public newPswChange(e: any) {
        this.state.pswAvailable = e.success;
        this.state.newPassword = e.password;
        this.state.pswEqualed = pswEqualed(this.state.newPassword, this.state.rePassword) && e.success;
        this.paint();
    }
    public rePswChange(e: any) {
        this.state.rePassword = e.value;
        this.state.pswEqualed = pswEqualed(this.state.newPassword, this.state.rePassword) && this.state.pswAvailable;
        this.paint();
    }

    /**
     * 点击确认按钮
     */
    public async btnClicked() {
        const oldPassword = this.state.oldPassword;
        const newPassword = this.state.newPassword;
        const rePassword = this.state.rePassword;
        const wallet = find('curWallet');
        if (!oldPassword || !newPassword || !rePassword) {
            popNew('app-components1-message-message', { content: this.state.cfgData.tips[0] });

            return;
        }
        // 判断输入的密码是否符合规则
        if (!this.state.pswAvailable) {
            // tslint:disable-next-line:max-line-length
            popNew('app-components1-message-message', { content: this.state.cfgData.tips[1] });

            return;
        }
        // 判断两次输入的密码是否相同
        if (!this.state.pswEqualed) {
            // tslint:disable-next-line:max-line-length
            popNew('app-components1-message-message', { content: this.state.cfgData.tips[2] });

            return;
        }
        const loading = popNew('app-components1-loading-loading', { text: this.state.cfgData.loading });
        const fg = await VerifyIdentidy(wallet,oldPassword);
        // 判断原密码是否正确
        if (!fg) {
            popNew('app-components1-message-message', { content: this.state.cfgData.tips[3] });
            loading.callback(loading.widget);

            return;
        }
        const gwlt = GlobalWallet.fromJSON(wallet.gwlt);
        await gwlt.passwordChange(oldPassword, newPassword);
        wallet.gwlt = gwlt.toJSON();
        loading.callback(loading.widget);
        this.backPrePage();
    }

}
