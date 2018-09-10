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
import { openAndGetRandom } from '../../net/pull';
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
    openAndGetRandom();
    // dataCenter.init();
    popNew('app-view-base-app');
    // popNew('app-view-wallet-create-createWallet');
    // popNew('app-view-wallet-create-createWalletByImage');
    // popNew('app-view-wallet-import-home');
    // popNew('app-view-play-home-home');
    // popNew('app-view-earn-redEnvelope-redEnvHistory');
    // popNew('app-view-earn-mining-dividend',{ ktBalance:0 });
    // popNew('app-view-mine-home-home');
    // popNew('app-view-mine-setting-phone');
    // popNew('app-components-keyBoard-keyBoard');
    // popNewPage();
    // 后台切前台
    // backToFront();

    // 解决进入时闪一下问题
    setTimeout(() => {
        if (cb) cb();
    },20);
    
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
            popNew('app-view-mine-lockScreen-unlockScreen-unlockScreen',{ firstEnter:true });
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
 * onBackPressed
 */
const backToFront = () => {
    (<any>window).handle_app_lifecycle_listener = (iType: string) => {
        if ((iType === 'onAppResumed') && ifNeedUnlockScreen()) {
            popNew('app-view-mine-lockScreen-unlockScreen-unlockScreen',{ firstEnter:false });
        } else if (iType === 'onBackPressed') {
            (<any>window).onpopstate();
            // widget.ok && widget.ok();
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
