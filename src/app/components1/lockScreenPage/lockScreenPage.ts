/**
 * pasword screen
 */
import { Json } from '../../../pi/lang/type';
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { LockScreen } from '../../store/interface';
import { find, updateStore } from '../../store/store';
import { getLanguage, lockScreenHash, lockScreenVerify } from '../../utils/tools';
import { VerifyIdentidy } from '../../utils/walletTools';

export class LockScreenPage extends Widget {
    public ok:(fg:boolean) => void;
    constructor() {
        super();
    }

    public setProps(oldProps:Json,props:Json) {
        super.setProps(oldProps,props);
        this.init();
    }

    public init() {
        const cfg = getLanguage(this);
        this.state = {
            cfgData:cfg,
            errorTips: cfg.errorTips,
            lockScreenPsw:'',  // 锁屏密码
            openLockScreen: false // 是否打开锁屏开关 
        };
        if (this.props.firstFg) {   // true表示设置锁屏密码，首次打开此界面
            this.setLockPsw();
        } else {
            this.oldLockPsw(0);
        }
    }

    /**
     * 关闭页面
     */
    public close(fg:boolean) {
        this.ok && this.ok(fg);
    }

    /**
     * 设置锁屏密码
     */
    public setLockPsw() {
        popNew('app-components1-keyboard-keyboard',{ title: this.state.cfgData.keyboardTitle[0] },(r) => {
            console.error(r);
            this.state.lockScreenPsw = r;
            this.reSetLockPsw();
        },() => {
            this.close(false);
        });
    }

    /**
     * 重复锁屏密码
     */
    public reSetLockPsw() {
        popNew('app-components1-keyboard-keyboard',{ title: this.state.cfgData.keyboardTitle[1] },(r) => {
            if (this.state.lockScreenPsw !== r) {
                popNew('app-components1-message-message',{ content:this.state.cfgData.tips[0] });
                this.reSetLockPsw();
            } else {
                const hash256 = lockScreenHash(r);
                const ls:LockScreen = find('lockScreen'); 
                ls.psw = hash256;
                ls.open = true;
                updateStore('lockScreen',ls);
                popNew('app-components1-message-message',{ content:this.state.cfgData.tips[1] });
            }
            this.close(true);
        },() => {
            this.close(false);
        });
    }

    /**
     * 输入原锁屏密码
     */
    public oldLockPsw(ind:number) {
        if (ind > 2) {
            const close = popNew('app-components1-loading-loading', { text: this.state.cfgData.loading }); 
            // tslint:disable-next-line:max-line-length
            popNew('app-components1-modalBoxInput-modalBoxInput',this.state.cfgData.modalBoxInput,async (r) => {
                const wallet = find('curWallet');
                const fg = await VerifyIdentidy(wallet,r);
                close.callback(close.widget);
                // const fg = true;
                if (fg) {  // 三次密码错误但成功验证身份后重新设置密码
                    this.setLockPsw();
                } else {
                    popNew('app-components1-message-message',{ content:this.state.cfgData.tips[2] });
                } 
            });
        } else {
            popNew('app-components1-keyboard-keyboard',{ title:this.state.errorTips[ind] },(r) => {
                if (lockScreenVerify(r)) {  // 原密码输入成功后重新设置密码
                    this.setLockPsw();
                } else {
                    if (this.props.open) {  // 进入APP解锁屏幕
                        this.close(true);
                    } else {
                        this.oldLockPsw(++ind);
                    }
                }
            });
        }
    }
}
