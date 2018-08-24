/**
 * lockScreen settings
 */
// ============================== 导入
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { find, updateStore } from '../../../store/store';
import { forgetPasswordClick } from './unlockScreen/unlockScreen';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class LockScreenSetting extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init() {
        const ls = find('lockScreen');
        this.state = {
            lockScreenPsw:ls.psw,
            openLockScreen: ls.psw && ls.open !== false,
            lockScreenTitle: '',
            numberOfErrors: 0,
            errorTips: ['请输入原来的密码', '已错误1次，还有两次机会', '最后1次，否则密码将会重置']
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
            popNew('app-view-mine-lockScreen-setLockScreenScret', { jump:true }, () => {
                this.state.lockScreenPsw = find('lockScreen').psw;
            });
        }
        this.state.openLockScreen = !this.state.openLockScreen;
        const ls = find('lockScreen');
        ls.open = this.state.openLockScreen;
        updateStore('lockScreen',ls);
        this.paint();

    }

    // 修改锁屏密码
    public resetLockScreen() {
        popNew('app-view-mine-lockScreen-unlockScreen',{ updatedPsw:true,jump:true });
    }

    public forgetPasswordClick() {
        forgetPasswordClick(null);
    }
}