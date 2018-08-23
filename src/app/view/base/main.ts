/**
 * @file 入口文件，用于登录，唤起hall界面
 * @author henk<speoth@163.com>
 */

// tslint:disable-next-line:no-any
// tslint:disable-next-line:no-reserved-keywords
declare const module;

import { popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { addWidget } from '../../../pi/widget/util';
import { LockScreen } from '../../store/interface';
import { initLocalStorageStore } from '../../store/localStorageStore';
import { find, initStore } from '../../store/store';

// ============================== 导出
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export const run = (cb): void => {
    addWidget(document.body, 'pi-ui-root');
    // 设置开发环境
    // eth代币精度初始化
    // 数据检查
    checkUpdate();
    // 初始化数据
    initStore();
    // 初始化localstorage
    initLocalStorageStore();
    // dataCenter.init();
    
    popNewPage();
    // popNew('app-view-guidePages-unlockScreen');
    // // 后台切前台
    backToFront();

    if (cb) cb();
    // test();
};

/**
 * 界面入口
 */
const popNewPage = () => {
    const readedPriAgr = find('readedPriAgr');
    if (readedPriAgr) {
        popNew('app-view-base-app');
        if (ifNeedUnlockScreen()) {
            popNew('app-view-guidePages-unlockScreen');
        }

    } else {
        popNew('app-view-guidePages-privacyAgreement');
    }
};
const checkUpdate = () => {
    // todo
};

/**
 * 后台切换到前台
 */
const backToFront = () => {
    (<any>window).handle_app_lifecycle_listener = (iType: string) => {
        if ((iType === 'onAppResumed') && ifNeedUnlockScreen()) {
            popNew('app-view-guidePages-unlockScreen');
        }
    };
};

// ============================== 立即执行

/**
 * 是否需要解锁屏幕
 */
const ifNeedUnlockScreen = () => {
    const unlockScreen = document.querySelector('#unlock-screen');
    if (unlockScreen) return false;
    const ls: LockScreen = find('lockScreen');
    const lockScreenPsw = ls.psw;
    const openLockScreen = ls.open !== false;

    return lockScreenPsw && openLockScreen;
};
