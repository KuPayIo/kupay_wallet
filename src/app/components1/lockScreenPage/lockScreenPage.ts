/**
 * pasword screen
 */
import { ExitApp } from '../../../pi/browser/exitApp';
import { Json } from '../../../pi/lang/type';
import { popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { LockScreen } from '../../store/interface';
import { getStore, register, setStore  } from '../../store/memstore';
import { getLanguage, lockScreenHash, lockScreenVerify } from '../../utils/tools';
import { getLang } from '../../../pi/util/lang';
// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
declare var pi_modules : any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class LockScreenPage extends Widget {
    public ok:(fg:boolean) => void;
    public language:any;
    constructor() {
        super();
    }

    public setProps(oldProps:Json,props:Json) {
        super.setProps(oldProps,props);
        this.init();
    }

    public init() {
        this.language = this.config.value[getLang()];
        this.state = {
            errorTips: this.language.errorTips,
            lockScreenPsw:'',  // 锁屏密码
            openLockScreen: false, // 是否打开锁屏开关 
            loading:false
        };
        if (this.props.setting) {   // true表示设置锁屏密码
            this.setLockPsw();
        } else if (this.props.openApp) {  // true表示打开app解锁屏幕
            this.unLockScreen(0);
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
        popNew('app-components1-keyboard-keyboard',{ title: this.language.keyboardTitle[0] },(r) => {
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
        popNew('app-components1-keyboard-keyboard',{ title: this.language.keyboardTitle[1] },(r) => {
            if (this.state.lockScreenPsw !== r) {
                popNew('app-components1-message-message',{ content:this.language.tips[0] });
                this.reSetLockPsw();
            } else {
                const hash256 = lockScreenHash(r);
                const ls:LockScreen = getStore('setting/lockScreen'); 
                ls.psw = hash256;
                ls.open = true;
                setStore('setting/lockScreen',ls);
                popNew('app-components1-message-message',{ content:this.language.tips[1] });
            }
            this.close(true);
        },() => {
            this.close(false);
        });
    }

    /**
     * 进入APP解锁屏幕
     */
    public unLockScreen(ind:number) {
        const ls:LockScreen = getStore('setting/lockScreen');
        if (ls.locked || ind > 2) {
            this.verifyPsw();
        } else {
            const title = this.state.errorTips[ind === 0 ? 3 :ind];
            popNew('app-components1-keyboard-keyboard',{ title:title,closePage:1 },(r) => {
                if (lockScreenVerify(r)) {  // 原密码输入成功后重新设置密码
                    this.close(true);
                } else {
                    this.unLockScreen(++ind);
                }
            });
        }
    }

    /**
     * 进入APP三次解锁屏幕失败后验证身份
     */
    public verifyPsw() {
        // tslint:disable-next-line:max-line-length
        popNew('app-components1-modalBoxInput-modalBoxInput',this.language.modalBoxInput2,async (r) => {
            const close = popNew('app-components1-loading-loading', { text: this.language.loading }); 
            if (this.state.loading) {
                const VerifyIdentidy = pi_modules.commonjs.exports.relativeGet('app/utils/walletTools').exports.VerifyIdentidy;
                const fg = await VerifyIdentidy(r);
                close.callback(close.widget);
                if (fg) {  // 三次密码错误但成功验证身份后重新设置密码
                    let ls:LockScreen = getStore('setting/lockScreen');
                    ls = {
                        psw:'',
                        open:false,
                        locked:false
                    };
                    setStore('setting/lockScreen',ls);
                    this.setLockPsw();
                    
                } else {  // 进入APP验证身份失败后再次进入验证身份步骤
                    popNew('app-components1-message-message',{ content:this.language.tips[2] });
                    this.verifyPsw();
                } 
            }
        },(fg) => {
            if (fg) {  // 退出app
                const ls:LockScreen = getStore('setting/lockScreen');
                ls.locked = true;
                setStore('setting/lockScreen',ls);
                const exitApp = new ExitApp();
                exitApp.init();
                exitApp.exitApplication({});
            }
        });
    }

    /**
     * 判断资源加载完成
     */
    public judgeLoading() {
        const loaded = getStore('flags/level_2_page_loaded');
        if (loaded) {
            this.state.loading = true;
            this.paint();
        }
    }
}
register('flags/level_2_page_loaded',(loaded:boolean) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.judgeLoading();
    }
});
