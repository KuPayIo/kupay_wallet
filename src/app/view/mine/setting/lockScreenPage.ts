/**
 * pasword screen
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { LockScreen } from '../../../store/interface';
import { find, updateStore } from '../../../store/store';
import { getLanguage, lockScreenHash, lockScreenVerify } from '../../../utils/tools';
import { VerifyIdentidy } from '../../../utils/walletTools';

export class LockScreenPage extends Widget {
    public ok:() => void;
    constructor() {
        super();
    }

    public create() {
        super.create();
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
        this.oldLockPsw(0);
    }

    /**
     * 关闭锁屏开关
     */
    public closeLockPsw() {
        this.state.openLockScreen = false;
        this.state.lockScreenPsw = '';
        this.paint();
    }

    /**
     * 重复锁屏密码
     */
    public reSetLockPsw() {
        popNew('app-components-keyboard-keyboard',{ title: this.state.cfgData.keyboardTitle[1] },(r) => {
            if (this.state.lockScreenPsw !== r) {
                popNew('app-components-message-message',{ content:this.state.cfgData.tips[0] });
                this.reSetLockPsw();
            } else {
                const hash256 = lockScreenHash(r);
                const ls:LockScreen = find('lockScreen'); 
                ls.psw = hash256;
                ls.open = true;
                updateStore('lockScreen',ls);
                popNew('app-components-message-message',{ content:this.state.cfgData.tips[1] });
            }
        },() => {
            this.closeLockPsw();
        });
    }

    /**
     * 输入原锁屏密码
     */
    public oldLockPsw(ind:number) {
        if (ind > 2) {
            const close = popNew('app-components1-loading-loading', { text: this.state.cfgData.loading }); 
            // tslint:disable-next-line:max-line-length
            popNew('app-components-modalBoxInput-modalBoxInput',this.state.cfgData.modalBoxInput,async (r) => {
                const wallet = find('curWallet');
                const fg = await VerifyIdentidy(wallet,r);
                close.callback(close.widget);
                // const fg = true;
                if (fg) {
                    popNew('app-components-keyboard-keyboard',{ title:this.state.cfgData.keyboardTitle[0] },(r) => {
                        this.state.lockScreenPsw = r;
                        this.reSetLockPsw();
                        
                    },() => {
                        this.closeLockPsw();

                        return false;
                    });
                } 
            });
        } else {
            popNew('app-components-keyboard-keyboard',{ title:this.state.errorTips[ind] },(r) => {
                if (lockScreenVerify(r)) {
                    popNew('app-components-keyboard-keyboard',{ title:this.state.cfgData.keyboardTitle[0] },(r) => {
                        this.state.lockScreenPsw = r;
                        this.reSetLockPsw();
                        
                    },() => {
                        this.closeLockPsw();

                        return false;
                    });
                } else {
                    this.oldLockPsw(++ind);
                }
            });
        }
    }
}
