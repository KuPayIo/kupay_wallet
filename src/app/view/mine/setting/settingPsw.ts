/**
 * create wallet
 */
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Widget } from '../../../../pi/widget/widget';
import { pswEqualed } from '../../../utils/account';
import { defaultPassword } from '../../../utils/constants';
import { popNewLoading, popNewMessage } from '../../../utils/tools';
import { passwordChange, VerifyIdentidy } from '../../../utils/walletTools';

export class SettingPsw extends Widget {
    public props: any;
    public ok: () => void;
    public cancel: () => void;
    public language: any;

    public setProps(props: any, oldProps: any) {
        this.language = this.config.value[getLang()];
        this.props = {
            ...props,
            walletPsw: '',
            walletPswConfirm: '',
            pswEqualed: false,
            userProtocolReaded: false,
            walletPswAvailable: false
        };
        super.setProps(this.props, oldProps);
    }
    public checkBoxClick(e: any) {
        this.props.userProtocolReaded = (e.newType === 'true' ? true : false);
        this.paint();
    }
    public pswConfirmChange(r: any) {
        this.props.walletPswConfirm = r.value;
        this.props.pswEqualed = pswEqualed(this.props.walletPsw, this.props.walletPswConfirm);
        this.paint();
    }
    // 密码格式正确通知
    public pswChange(res: any) {
        this.props.walletPswAvailable = res.success;
        this.props.walletPsw = res.password;
        this.props.pswEqualed = pswEqualed(this.props.walletPsw, this.props.walletPswConfirm);
        this.paint();
    }

    // 清除密码
    public pwsClear() {
        this.props.walletPsw = '';
        this.paint();
    }

    public async createClick() {
        if (!this.props.userProtocolReaded) {
            return;
        }
        if (!this.props.walletPsw || !this.props.walletPswConfirm) {
            popNew('app-components1-message-message', { content: this.language.tips[0] });

            return;
        }
        if (!this.props.walletPswAvailable) {
            popNew('app-components1-message-message', { content: this.language.tips[1] });

            return;
        }
        if (!this.props.pswEqualed) {
            popNew('app-components1-message-message', { content: this.language.tips[2] });

            return;
        }
        const loading = popNewLoading('正在设置');
        const secretHash = await VerifyIdentidy(defaultPassword);
        // 判断原密码是否正确
        if (!secretHash) {
            popNewMessage('设置失败');
            loading.callback(loading.widget);

            return;
        }
        await passwordChange(secretHash, this.props.walletPsw);
        loading.callback(loading.widget);
        popNewMessage('设置成功');
        this.ok && this.ok();
        popNew('app-view-mine-setting-phone',{});
    }

    /**
     * 查看隐私条约
     */
    public agreementClick() {
        popNew('app-view-mine-other-privacypolicy');
    }

}
