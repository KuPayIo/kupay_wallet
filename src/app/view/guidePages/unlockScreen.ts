/**
 * unlock screen
 */
// ============================== 导入
import { popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { GlobalWallet } from '../../core/globalWallet';
import { find, updateStore } from '../../store/store';
import { lockScreenVerify, VerifyIdentidy } from '../../utils/tools';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class UnlockScreen extends Widget {
    public ok: () => void;
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
            if (this.props && this.props.updatedPsw) {
                popNew('app-components-message-message', { itype: 'success', content:'验证成功,请输入新密码', center: true });
                popNew('app-view-guidePages-setLockScreenScret', { title1: '请输入新密码', title2: '请重复新密码' ,jump:true });
            }
            this.ok && this.ok();

            return;
        }

        this.state.numberOfErrors++;
        if (this.state.numberOfErrors >= 3) {
            const ls = find('lockScreen');
            ls.locked = true;
            updateStore('lockScreen',ls);// 更新屏幕锁定
            popMessageboxVerify(this);

            return;
        }
        this.state.passwordScreenTitle = this.state.errorTips[this.state.numberOfErrors];
        this.paint();
    }
    
    public forgetPasswordClick() {
        forgetPasswordClick(this);
    }
    public jumpClick() {
        this.ok && this.ok();
    }
}

// ===========================================本地

// 弹出密码验证框
const popMessageboxVerify = (that:any) => {
    const wallet = find('curWallet');
    const gwlt = GlobalWallet.fromJSON(wallet.gwlt);
    const messageboxVerifyProps = {
        title: '重置锁屏密码',
        content: '错误次数过多，已被锁定，请验证当前钱包交易密码后重置',
        inputType: 'password',
        tipsTitle: gwlt.nickName,
        tipsImgUrl: wallet.avatar,
        placeHolder: '请输入交易密码'
    };
    popNew('app-components-message-messageboxVerify', messageboxVerifyProps, (password) => {
        verifyLongPsw(password,that);
    });
};

// 验证密码
const verifyLongPsw = async (psw: string,that:any) => {
    const close = popNew('pi-components-loading-loading', { text: '验证中...' });
    const wallet = find('curWallet');
    const ls = find('lockScreen');
    const isEffective = await VerifyIdentidy(wallet, psw,false);
    close.callback(close.widget);
    if (isEffective) {
        popNew('app-components-message-message', { itype: 'success', content:'验证成功,请重新设置锁屏密码', center: true });
        popNew('app-view-guidePages-setLockScreenScret', { title1: '请输入新密码', title2: '请重复新密码' ,jump:true });
        ls.locked = false;
        updateStore('lockScreen',ls);// 更新屏幕锁定
        that && that.ok && that.ok();
    } else {
        popNew('app-components-message-message', { itype: 'error', content:'密码错误', center: true });
        if (ls.locked) {
            popMessageboxVerify(that);
        }
        
    }
};

export const forgetPasswordClick = (that:any) => {
    const wallet = find('curWallet');
    const gwlt = GlobalWallet.fromJSON(wallet.gwlt);
    const messageboxVerifyProps = {
        title: '忘记密码',
        content: '忘记锁屏密码，请验证当前钱包交易密码后重置',
        inputType: 'password',
        tipsTitle: gwlt.nickName,
        tipsImgUrl: wallet.avatar,
        placeHolder: '请输入交易密码'
    };
    popNew('app-components-message-messageboxVerify', messageboxVerifyProps, (psw) => {
        verifyLongPsw(psw,that);
    });
};