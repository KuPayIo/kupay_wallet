/**
 * @file 入口文件，用于登录，唤起hall界面
 * @author henk<speoth@163.com>
 */

// tslint:disable-next-line:no-any
// tslint:disable-next-line:no-reserved-keywords
declare const module;

import { ExitApp } from '../../../pi/browser/exitApp';
import { backCall, backList, popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { addWidget } from '../../../pi/widget/util';
import { getScreenModify } from '../../logic/native';
import { openConnect } from '../../net/pull';
import { initPush } from '../../net/push';
import { LockScreen } from '../../store/interface';
import { getStore, initStore, setStore } from '../../store/memstore';
import { fetchDeviceId } from '../../utils/tools';

// ============================== 导出

export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export const run = (cb): void => {
    addWidget(document.body, 'pi-ui-root');
    // 设置开发环境
    // eth代币精度初始化
    // 数据检查
    checkUpdate();
    console.time('initStore');
    // 初始化数据
    initStore().then(() => {
        console.timeEnd('initStore');
        // 打开首页面
        popNewRouterList(cb);
        // 主动推送初始化
        initPush();
        // popNew('earn-client-app-test-test');
    });
    
    // 预先从底层获取一些数据
    preFetchFromNative();
    // 连接服务
    openConnect();
    console.timeEnd('home enter');
    // 后台切前台
    backToFront();
    
};

/**
 * 弹出上次关闭的界面
 */
const popNewRouterList = (cb:Function) => {
    const routerList = JSON.parse(localStorage.getItem('pi_router_list'));
    if (routerList && routerList.length > 0) {
        for (let i = 0;i < routerList.length;i++) {
            const props = routerList[i].props;
            if (props && props.pi_norouter) break;
            popNew(routerList[i].name,routerList[i].props);
        }
    } else { // 首次进入
        popNew('app-view-base-app');
        if (!localStorage.firstInApp) {
            popNew('app-components1-modalBox-newUserWelfare');
            localStorage.setItem('firstInApp','true');
        }
    }
    
    // 解决进入时闪一下问题
    setTimeout(() => {
        if (cb) cb();
        console.timeEnd('first page');
    }, 300);

    popNewPage();
};

/**
 * 界面入口
 */
const popNewPage = () => {
    if (ifNeedUnlockScreen()) {
        popNew('app-components1-lockScreenPage-lockScreenPage', {
            openApp: true
        });
    }
};

/**
 * 预先从底层获取一些数据
 */
const preFetchFromNative = () => {
    const deviceId = getStore('setting/deviceId');
    if (!deviceId) {
        fetchDeviceId().then(hash256deviceId => {
            setStore('setting/deviceId',hash256deviceId);
        });
    }
    getScreenModify();
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
        if (iType === 'onAppResumed' && ifNeedUnlockScreen()) {
            popNew('app-components1-lockScreenPage-lockScreenPage', {
                openApp: true
            });
        } else if (iType === 'onBackPressed') {
            if (backList.length === 1) {
                const exitApp = new ExitApp();
                exitApp.init();
                exitApp.ToHome({});
            } else {
                backCall();
            }
      // (<any>window).onpopstate();
      // widget.ok && widget.ok();
        }
    };
};

// ============================== 立即执行

/**
 * 是否需要解锁屏幕
 */
const ifNeedUnlockScreen = () => {
    const unlockScreen = document.getElementById('keyboard');
    if (unlockScreen) return false;
    const ls: LockScreen = getStore('setting/lockScreen',{});
    const lockScreenPsw = ls.psw;
    const openLockScreen = ls.open !== false;

    return lockScreenPsw && openLockScreen;
};