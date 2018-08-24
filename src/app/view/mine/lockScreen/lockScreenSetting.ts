/**
 * lockScreen settings
 */
// ============================== 导入
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { LockScreen } from '../../../store/interface';
import { find, register, updateStore } from '../../../store/store';
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
            popNew('app-view-mine-lockScreen-setLockScreen-setLockScreenScret', { jump:true });

            return;
        }
        this.state.openLockScreen = !this.state.openLockScreen;
        const ls = find('lockScreen');
        ls.open = this.state.openLockScreen;
        updateStore('lockScreen',ls);
    }

    // 修改锁屏密码
    public resetLockScreen() {
        popNew('app-view-mine-lockScreen-unlockScreen-unlockScreen',{ updatedPsw:true,jump:true });
    }

    public forgetPasswordClick() {
        forgetPasswordClick(null);
    }

    public updateLockScreen(ls:LockScreen) {
        this.state.lockScreenPsw = ls.psw;
        this.state.openLockScreen = ls.open;
        this.paint();
    }
}

register('lockScreen',(ls:LockScreen) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateLockScreen(ls);
    }
});