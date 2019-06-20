/**
 * pasword screen
 */
import { Json } from '../../../pi/lang/type';
import { popNew } from '../../../pi/ui/root';
import { getLang } from '../../../pi/util/lang';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { callLockScreenHash, callLockScreenVerify, callVerifyIdentidy,getStoreData, registerStore, setStoreData } from '../../middleLayer/wrap';
import { LockScreen } from '../../publicLib/interface';
import { popNewLoading, popNewMessage } from '../../utils/tools';
import { logoutAccount } from '../../viewLogic/login';
// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class LockScreenPage extends Widget {
    public ok:(fg:boolean) => void;
    public language:any;
    constructor() {
        super();
    }

    public setProps(props:Json,oldProps:Json) {
        this.props = {
            ...props,
            pi_norouter:true
        };
        super.setProps(this.props,oldProps);
        this.init();
    }

    public init() {
        this.language = this.config.value[getLang()];
        this.props = {
            ...this.props,
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
            this.props.lockScreenPsw = r;
            this.reSetLockPsw();
        },() => {
            this.close(false);
        });
    }

    /**
     * 重复锁屏密码
     */
    public reSetLockPsw() {
        popNew('app-components1-keyboard-keyboard',{ title: this.language.keyboardTitle[1] },async (r) => {
            if (this.props.lockScreenPsw !== r) {
                popNewMessage(this.language.tips[0]);
                this.reSetLockPsw();
            } else {
                await Promise.all([callLockScreenHash(r),getStoreData('setting/lockScreen')]).then(([hash256,ls]) => {
                    ls.psw = hash256;
                    ls.open = true;
                    setStoreData('setting/lockScreen',ls);
                    popNewMessage(this.language.tips[1]);
                });
            }
            this.close(true);
        },() => {
            this.close(false);
        });
    }

    /**
     * 进入APP解锁屏幕
     */
    public async unLockScreen(ind:number) {
        const ls:LockScreen = await getStoreData('setting/lockScreen');
        if (ls.locked || ind > 2) {
            ls.locked = true;
            await setStoreData('setting/lockScreen',ls);
            this.verifyPsw();
        } else {
            const title = this.props.errorTips[ind === 0 ? 3 :ind];
            popNew('app-components1-keyboard-keyboard',{ title:title,closePage:1 },async (r) => {
                const verify = await callLockScreenVerify(r);
                if (verify) {  // 原密码输入成功后重新设置密码
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
        popNew('app-components-modalBoxInput-modalBoxInput',this.language.modalBoxInput2, async (r) => {
            if (!r) {  // 未输入密码点击验证则重新打开验证
                popNewMessage(this.language.tips[3]);
                this.verifyPsw();

                return;
            }
            const close = popNewLoading(this.language.loading); 
            if (this.props.loading) {
                const fg = await callVerifyIdentidy(r);
                close.callback(close.widget);
                if (fg) {  // 三次密码错误但成功验证身份后重新设置密码
                    let ls:LockScreen = await getStoreData('setting/lockScreen');
                    ls = {
                        psw:'',
                        open:false,
                        locked:false
                    };
                    setStoreData('setting/lockScreen',ls);
                    this.setLockPsw();
                    
                } else {  // 进入APP验证身份失败后再次进入验证身份步骤
                    popNewMessage(this.language.tips[2]);
                    this.verifyPsw();
                } 
            }
        },(fg) => {
            if (fg) {  // 退出当前钱包，跳转到登录页面
                logoutAccount();
            }
        });
    }

    /**
     * 判断资源加载完成
     */
    public judgeLoading() {
        const loaded = getStoreData('flags/level_3_page_loaded');
        if (loaded) {
            this.props.loading = true;
            this.paint();
        }
    }
}

registerStore('flags/level_3_page_loaded',(loaded:boolean) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.judgeLoading();
    }
});
