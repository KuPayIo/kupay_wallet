/**
 * changePSW
 */
// =============================================导入
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { pswEqualed } from '../../../utils/account';
import { passwordChange, VerifyIdentidy } from '../../../utils/walletTools';
import { register } from '../../../store/memstore';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class ChangePSW extends Widget {
    public ok: () => void;
    public language:any;
    constructor() {
        super();
    }

    public create() {
        super.create();
        this.language = this.config.value[getLang()];
        this.state = {
            oldPassword:'',
            newPassword:'',
            rePassword:'',
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
        if (!oldPassword || !newPassword || !rePassword) {
            popNew('app-components1-message-message', { content: this.language.tips[0] });

            return;
        }
        // 判断输入的密码是否符合规则
        if (!this.state.pswAvailable) {
            // tslint:disable-next-line:max-line-length
            popNew('app-components1-message-message', { content: this.language.tips[1] });

            return;
        }
        // 判断两次输入的密码是否相同
        if (!this.state.pswEqualed) {
            // tslint:disable-next-line:max-line-length
            popNew('app-components1-message-message', { content: this.language.tips[2] });

            return;
        }
        const loading = popNew('app-components1-loading-loading', { text: this.language.loading });
        const fg = await VerifyIdentidy(oldPassword);
        // 判断原密码是否正确
        if (!fg) {
            popNew('app-components1-message-message', { content: this.language.tips[3] });
            loading.callback(loading.widget);

            return;
        }
        await passwordChange(oldPassword, newPassword);
        loading.callback(loading.widget);
        popNew('app-components1-message-message', { content: this.language.tips[4] });
        this.backPrePage();
    }
}

