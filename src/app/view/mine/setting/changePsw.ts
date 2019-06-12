/**
 * changePSW
 */
// =============================================导入
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { callPasswordChange, callVerifyIdentidy } from '../../../middleLayer/walletBridge';
import { pswEqualed } from '../../../utils/account';
import { popNewLoading, popNewMessage } from '../../../utils/tools';
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
        this.props = {
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
        this.props.oldPassword = e.value;
    }
    public newPswChange(e: any) {
        this.props.pswAvailable = e.success;
        this.props.newPassword = e.password;
        this.props.pswEqualed = pswEqualed(this.props.newPassword, this.props.rePassword) && e.success;
        this.paint();
    }
    public rePswChange(e: any) {
        this.props.rePassword = e.value;
        this.props.pswEqualed = pswEqualed(this.props.newPassword, this.props.rePassword) && this.props.pswAvailable;
        this.paint();
    }
    public pswClear(pswType: number) {
        switch (pswType) {
            case 0:
                this.props.oldPassword = '';
                break;
            case 1:
                this.props.newPassword = '';
                break;
            case 2:
                this.props.rePassword = '';
                break;
            default:
        }
    }

    /**
     * 点击确认按钮
     */
    public async btnClicked() {
        const oldPassword = this.props.oldPassword;
        const newPassword = this.props.newPassword;
        const rePassword = this.props.rePassword;
        if (!oldPassword || !newPassword || !rePassword) {
            popNewMessage(this.language.tips[0]);

            return;
        }
        // 判断输入的密码是否符合规则
        if (!this.props.pswAvailable) {
            popNewMessage(this.language.tips[1]);

            return;
        }
        // 判断两次输入的密码是否相同
        if (!this.props.pswEqualed) {
            popNewMessage(this.language.tips[2]);

            return;
        }
        const loading = popNewLoading(this.language.loading);
        const secretHash = await callVerifyIdentidy(oldPassword);
        // 判断原密码是否正确
        if (!secretHash) {
            popNewMessage(this.language.tips[3]);
            loading.callback(loading.widget);

            return;
        }
        await callPasswordChange(secretHash, newPassword);
        loading.callback(loading.widget);
        popNewMessage(this.language.tips[4]);
        this.backPrePage();
    }
}
