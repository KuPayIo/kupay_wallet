/**
 * changePSW
 */
// =============================================导入
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { GlobalWallet } from '../../../core/globalWallet';
import { find, updateStore } from '../../../store/store';
import { pswEqualed, walletPswAvailable } from '../../../utils/account';
// ================================================导出
export class ChangePSW extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }

    public create() {
        super.create();
        let cfg = this.config.value.simpleChinese;
        const lan = find('languageSet');
        if (lan) {
            cfg = this.config.value[lan.languageList[lan.selected]];
        }
        this.state = {
            oldPassword:'',
            newPassword:'',
            rePassword:'',
            cfgData:cfg
        };
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
            // tslint:disable-next-line:max-line-length
            popNew('app-components-message-messagebox', { itype: 'alert', title: this.state.cfgData.tips[0], content: this.state.cfgData.tips[1] });

            return;
        }
        if (!walletPswAvailable(newPassword)) {
            // tslint:disable-next-line:max-line-length
            popNew('app-components-message-messagebox', { itype: 'alert', title: this.state.cfgData.tips[0], content: this.state.cfgData.tips[2] });

            return;
        }
        // 验证全部通过，开始设置新密码
        const loading = popNew('app-components_level_1-loading-loading', { text: this.state.cfgData.loading });
        const gwlt = GlobalWallet.fromJSON(wallet.gwlt);
        await gwlt.passwordChange(this.state.oldPassword, newPassword);
        wallet.gwlt = gwlt.toJSON();
        updateStore('walletList', walletList);
        loading.callback(loading.widget);
        this.backPrePage();
    }

}
