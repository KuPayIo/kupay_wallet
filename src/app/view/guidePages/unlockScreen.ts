/**
 * unlock screen
 */
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { GlobalWallet } from '../../core/globalWallet';
import { find } from '../../store/store';
import { lockScreenVerify, VerifyIdentidy } from '../../utils/tools';

export class UnlockScreen extends Widget {
    public ok: () => void;

    constructor() {
        super();

    }

    public create() {
        super.create();
        this.init();
    }

    public init() {
        this.state = {
            passwordScreenTitle: '解锁屏幕',
            numberOfErrors: 0,
            errorTips: ['解锁屏幕', '已错误1次，还有两次机会', '最后1次，否则密码将会重置']
        };

    }

    public completedInput(r: any) {
        const psw = r.psw;
        if (lockScreenVerify(psw)) {
            this.ok && this.ok();

            return;
        }

        this.state.numberOfErrors++;
        if (this.state.numberOfErrors >= 3) {
            const wallet = find('curWallet');
            const gwlt = GlobalWallet.fromJSON(wallet.gwlt);
            const messageboxVerifyProps = {
                title: '重置锁屏密码',
                content: '错误次数过多，已被锁定，请验证当前钱包交易密码后重置',
                inputType: 'password',
                tipsTitle: gwlt.nickName,
                tipsImgUrl: wallet.avatar,
                placeHolder: '请输入交易密码',
                confirmCallBack: this.verifyLongPsw,
                confirmErrorText: '密码错误,请重新输入'
            };
            popNew('app-components-message-messageboxVerify', messageboxVerifyProps, () => {
                popNew('app-view-guidePages-setLockScreenScret', { title1: '请输入新密码', title2: '请重复新密码' });
                this.ok && this.ok();
            }, () => {
                this.init();
                this.paint();
            });

            return;
        }
        this.state.passwordScreenTitle = this.state.errorTips[this.state.numberOfErrors];
        this.paint();
    }

    // 验证密码
    public verifyLongPsw(psw: string) {
        const wallet = find('curWallet');

        return VerifyIdentidy(wallet, psw);
    }

    public forgetPasswordClick() {
        const wallet = find('curWallet');
        const gwlt = GlobalWallet.fromJSON(wallet.gwlt);
        const messageboxVerifyProps = {
            title: '忘记密码',
            content: '忘记锁屏密码，请验证当前钱包交易密码后重置',
            inputType: 'password',
            tipsTitle: gwlt.nickName,
            tipsImgUrl: wallet.avatar,
            placeHolder: '请输入交易密码',
            confirmCallBack: this.verifyLongPsw,
            confirmErrorText: '密码错误,请重新输入'
        };
        popNew('app-components-message-messageboxVerify', messageboxVerifyProps, () => {
            popNew('app-view-guidePages-setLockScreenScret', { title1: '请输入新密码', title2: '请重复新密码' });
            this.ok && this.ok();
        }, () => {
            this.init();
            this.paint();
        });
    }
}
