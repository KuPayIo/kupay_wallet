/**
 * create wallet
 */
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Widget } from '../../../../pi/widget/widget';
import { setStore } from '../../../store/memstore';
import { pswEqualed } from '../../../utils/account';
import { defaultPassword } from '../../../utils/constants';
import { getUserInfo, popNewLoading, popNewMessage } from '../../../utils/tools';
import { passwordChange, VerifyIdentidy } from '../../../utils/walletTools';

export class SettingPsw extends Widget {
    public props: any;
    public ok: () => void;
    public cancel: () => void;

    public setProps(props: any, oldProps: any) {
        this.props = {
            ...props,
            walletPsw: '',
            walletPswConfirm: '',
            pswEqualed: false,
            userProtocolReaded: true,
            walletPswAvailable: false
        };
        super.setProps(this.props, oldProps);
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
            const tips = { zh_Hans:'请输入支付密码',zh_Hant:'請輸入支付密碼',en:'' };
            popNewMessage(tips[getLang()]);

            return;
        }
        if (!this.props.walletPswAvailable) {
            const tips = { zh_Hans:'密码格式不正确',zh_Hant:'密碼格式不正確',en:'' };
            popNewMessage(tips[getLang()]);

            return;
        }
        if (!this.props.pswEqualed) {
            const tips = { zh_Hans:'密码不一致',zh_Hant:'密碼不一致',en:'' };
            popNewMessage(tips[getLang()]);

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
        setStore('flags/setPsw',false);
        this.ok && this.ok();
        const userInfo = getUserInfo();
        if (!userInfo.phoneNumber) {
            popNew('app-view-mine-setting-phone',{ jump:true });
        }
        
    }

    /**
     * 查看隐私条约
     */
    public agreementClick() {
        popNew('app-view-mine-other-privacypolicy');
    }

}
