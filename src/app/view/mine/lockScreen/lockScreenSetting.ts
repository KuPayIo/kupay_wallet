/**
 * lockScreen settings
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { GlobalWallet } from '../../../core/globalWallet';
import { getCurrentWallet, getLocalStorage,lockScreenVerify,setLocalStorage } from '../../../utils/tools';

export class DisplayPage extends Widget {
    public ok :() => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init() {
        const lockScreenPsw = getLocalStorage('lockScreenPsw');
        this.state = {
            lockScreenPsw,
            openLockScreen:lockScreenPsw && getLocalStorage('openLockScreen') !== false,
            lockScreenTitle:'',
            showLockScreen:false,
            numberOfErrors:0,
            errorTips:['请输入原来的密码','已错误1次，还有两次机会','最后1次，否则密码将会重置']
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }

    /**
     * 处理滑块改变
     */
    public onSwitchChange() {
        if (!this.state.lockScreenPsw) {
            popNew('app-view-guidePages-setLockScreenScret',{},() => {
                this.state.lockScreenPsw = getLocalStorage('lockScreenPsw');
            });
        } 
        this.state.openLockScreen = !this.state.openLockScreen;
        setLocalStorage('openLockScreen',this.state.openLockScreen);
        this.paint();
        
    }

    // 修改锁屏密码
    public resetLockScreen() {
        this.state.lockScreenTitle = '请输入原来的密码';
        this.state.showLockScreen = true;
        this.paint();
    }

    public completedInput(r:any) {
        const psw = r.psw;
        if (lockScreenVerify(psw)) {
            popNew('app-view-guidePages-setLockScreenScret',{ title1:'请输入新密码',title2:'请重复新密码' });
            this.ok && this.ok();
            
            return;
        } 
        this.state.numberOfErrors++;
        if (this.state.numberOfErrors >= 3) {
            const wallets = getLocalStorage('wallets');
            const wallet = getCurrentWallet(wallets);
            const gwlt = GlobalWallet.fromJSON(wallet.gwlt);
            const messageboxVerifyProps = {
                title: '重置锁屏密码', 
                content: '错误次数过多，已被锁定，请验证当前钱包长密码后重置',
                inputType:'password',
                tipsTitle:gwlt.nickName,
                tipsImgUrl:wallet.avatar,
                placeHolder:'请输入长密码',
                confirmCallBack:this.verifyLongPsw,
                confirmErrorText:'密码错误,请重新输入'
            };
            popNew('app-components-message-messageboxVerify', messageboxVerifyProps,() => {
                popNew('app-view-guidePages-setLockScreenScret',{ title1:'请输入新密码',title2:'请重复新密码' });
                this.ok && this.ok();
            },() => {
                this.init();
                this.paint();
            });

            return;
        }
        this.state.lockScreenTitle = this.state.errorTips[this.state.numberOfErrors];
        this.paint();

    }

    // 验证密码
    public verifyLongPsw(r:string) {
        return true;
    }

    public forgetPasswordClick() {
        // tslint:disable-next-line:max-line-length
        const wallets = getLocalStorage('wallets');
        const wallet = getCurrentWallet(wallets);
        const gwlt = GlobalWallet.fromJSON(wallet.gwlt);
        const messageboxVerifyProps = {
            title: '忘记密码', 
            content: '忘记锁屏密码，请验证当前钱包长密码后重置',
            inputType:'password',
            tipsTitle:gwlt.nickName,
            tipsImgUrl:wallet.avatar,
            placeHolder:'请输入长密码',
            confirmCallBack:this.verifyLongPsw,
            confirmErrorText:'密码错误,请重新输入'
        };
        popNew('app-components-message-messageboxVerify', messageboxVerifyProps,() => {
            popNew('app-view-guidePages-setLockScreenScret',{ title1:'请输入新密码',title2:'请重复新密码' });
            this.ok && this.ok();
        },() => {
            this.init();
            this.paint();
        });
    }
}