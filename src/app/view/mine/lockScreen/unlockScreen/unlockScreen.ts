/**
 * unlock screen
 */
// ============================== 导入
import { popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { find, register, updateStore } from '../../../../store/store';
import { lockScreenVerify } from '../../../../utils/tools';
import { VerifyIdentidy } from '../../../../utils/walletTools';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface Props {
    firstEnter:boolean;// 是否首次进入
}
export class UnlockScreen extends Widget {
    public ok: () => void;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }

    public init() {
        this.state = {
            level_3_page_loaded:this.props && this.props.firstEnter ? false : true,
            loading:null,
            passwordScreenTitle: '解锁屏幕',
            numberOfErrors: 0,
            errorTips: ['解锁屏幕', '已错误1次，还有两次机会', '最后1次，否则密码将会重置']
        };

    }
    public updateLevel_3_page_loaded() {
        this.state.level_3_page_loaded = true;
        this.paint();
    }
    public completedInput(r: any) {
        const psw = r.psw;
        if (lockScreenVerify(psw)) {
            if (this.props && this.props.updatedPsw) {
                popNew('app-components-message-message', { itype: 'success', content:'验证成功,请输入新密码', center: true });
                popNew('app-view-mine-lockScreen-setLockScreen-setLockScreenScret', { title1: '请输入新密码', title2: '请重复新密码' ,jump:true });
            }
            this.ok && this.ok();

            return;
        }

        this.state.numberOfErrors++;
        if (this.state.numberOfErrors >= 3) {
            const ls = find('lockScreen');
            ls.locked = true;
            updateStore('lockScreen',ls);// 更新屏幕锁定
            if (!this.state.level_3_page_loaded) {
                this.state.loading = popNew('app-components_level_1-loading-loading', { text: '加载资源中...' });
    
                return;
            }
            popMessageboxVerify(this);

            return;
        }
        this.state.passwordScreenTitle = this.state.errorTips[this.state.numberOfErrors];
        this.paint();
    }
    
    public forgetPasswordClick() {
        if (!this.state.level_3_page_loaded) {
            this.state.loading = popNew('app-components_level_1-loading-loading', { text: '加载资源中...' });

            return;
        }
        forgetPasswordClick(this);
    }
    public jumpClick() {
        this.ok && this.ok();
    }

    public closeLoading() {
        const close = this.state.loading;
        if (close) {
            close.callback(close.widget);
        }
        const ls = find('lockScreen');
        if (ls.locked) {
            popMessageboxVerify(this); 
        }
        this.paint();
    }
}

// ===========================================本地

// 弹出密码验证框
const popMessageboxVerify = (that:any) => {
    const wallet = find('curWallet');
    const gwlt = JSON.parse(wallet.gwlt);
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
    const close = popNew('app-components_level_1-loading-loading', { text: '验证中...' });
    const wallet = find('curWallet');
    const ls = find('lockScreen');
    const isEffective = await VerifyIdentidy(wallet, psw,false);
    close.callback(close.widget);
    if (isEffective) {
        popNew('app-components-message-message', { itype: 'success', content:'验证成功,请重新设置锁屏密码', center: true });
        popNew('app-view-mine-lockScreen-setLockScreen-setLockScreenScret', { title1: '请输入新密码', title2: '请重复新密码' ,jump:true });
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
    const gwlt = JSON.parse(wallet.gwlt);
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

register('level_3_page_loaded',(loaded:boolean) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateLevel_3_page_loaded();
        w.closeLoading();
    }
});
