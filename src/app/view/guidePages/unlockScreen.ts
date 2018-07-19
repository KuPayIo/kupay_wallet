/**
 * unlock screen
 */
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { GlobalWallet } from '../../core/globalWallet';
import { lockScreenSalt } from '../../utils/constants';
import { getCurrentWallet, getLocalStorage, sha256 } from '../../utils/tools';

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
            passwordScreenTitle:'解锁屏幕',
            numberOfErrors:0,
            errorTips:['解锁屏幕','已错误1次，还有两次机会','最后1次，否则密码将会重置']
        };
        
    }

    public completedInput(r:any) {
        const psw = r.psw;
        const hash256 = sha256(psw + lockScreenSalt);
        const localHash256 = getLocalStorage('lockScreenPsw');
        if (hash256 === localHash256) {
            setTimeout(() => {
                this.ok && this.ok();
            },200);

            return;
        }
        
        setTimeout(() => {
            this.state.numberOfErrors++;
            if (this.state.numberOfErrors >= 3) {
                const wallets = getLocalStorage('wallets');
                const wallet = getCurrentWallet(wallets);
                const gwlt = GlobalWallet.fromJSON(wallet.gwlt);
                const messageboxVerifyProps = {
                    itype: 'prompt', 
                    title: '重置锁屏密码', 
                    content: '错误次数过多，已被锁定，请验证当前钱包长密码后重置',
                    inputType:'password',
                    tipsTitle:gwlt.nickName,
                    tipsImgUrl:wallet.avatar,
                    confirmCallBack:this.verifyLongPsw,
                    confirmErrorText:'密码错误,请重新输入'
                };
                popNew('app-components-message-messageboxVerify', messageboxVerifyProps,() => {
                    popNew('app-view-guidePages-setLockScreenScret');
                    this.ok && this.ok();
                },() => {
                    this.init();
                    this.paint();
                });

                return;
            }
            this.state.passwordScreenTitle = this.state.errorTips[this.state.numberOfErrors];
            this.paint();
        },200);
    }

    // 验证密码
    public verifyLongPsw(r:string) {
        return false;
    }

    public forgetPasswordClick() {
        // tslint:disable-next-line:max-line-length
        popNew('app-components-message-messagebox', { itype: 'prompt', title: '忘记密码', content: '忘记锁屏密码，请验证当前钱包长密码后重置',inputType:'password' }, (r) => {
            console.log(r);

        });
    }
}
