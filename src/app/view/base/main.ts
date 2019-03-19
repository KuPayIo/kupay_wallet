/**
 * @file 入口文件，用于登录，唤起hall界面
 * @author henk<speoth@163.com>
 */

import { backCall, backList, popNew } from '../../../pi/ui/root';
import { addWidget } from '../../../pi/widget/util';
import { LockScreen } from '../../store/interface';
import { getAllAccount, getStore, setStore } from '../../store/memstore';
import { piRequire } from '../../utils/commonjsTools';
import { fetchDeviceId } from '../../utils/tools';

// ============================== 导出
declare var pi_modules;
export const run = (cb): void =>  {
    addWidget(document.body, 'pi-ui-root');
    // 数据检查
    checkUpdate();
    // 打开首页面
    popNew('app-view-base-app');
    if (!getStore('user/id')) {
        if (getAllAccount().length > 0) {
            popNew('app-view-base-entrance1');
        } else {
            popNew('app-view-base-entrance');
        }
    }
    // 锁屏页面
    popNewPage();
    // 预先从底层获取一些数据
    preFetchFromNative();
    console.timeEnd('home enter');
    // app event 注册
    addAppEvent();
    // 解决进入时闪一下问题
    setTimeout(() => {
        if (cb) cb();
    }, 100);
};

/**
 * 界面入口
 */
const popNewPage = () => {
    if (ifNeedUnlockScreen()) {
        popNew('app-components-lockScreenPage-lockScreenPage', {
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

    piRequire(['app/logic/native']).then(mods => {
        mods[0].getScreenModify();
        // 预先随机下载
        mods[0].preLoadAd(undefined,() => {
            mods[0].preLoadAd(undefined,() => {
                mods[0].preLoadAd(undefined);
            });
        });
    });
};
const checkUpdate = () => {
  // todo
};

/**
 * 注册app event
 */
const addAppEvent = () => {
    piRequire(['pi/browser/app_comon_event','pi/browser/exitApp']).then(mods => {
        const addAppResumed = mods[0].addAppResumed;
        const addAppBackPressed = mods[0].addAppBackPressed;
        // 注册appResumed
        addAppResumed(() => {
            console.log('addAppResumed callback called');
            if (ifNeedUnlockScreen()) {
                popNew('app-components-lockScreenPage-lockScreenPage', {
                    openApp: true
                });
            }
            setTimeout(() => {
                const reconnect =  pi_modules.commonjs.exports.relativeGet('app/net/reconnect').exports;
                if (reconnect && !reconnect.getAllIsLogin()) {
                    reconnect.manualReconnect();
                }
            },100);  // 检查是否已经退出登录
        });

        // 注册appBackPressed
        addAppBackPressed(() => {
            console.log('addAppBackPressed callback called');
            if (backList.length === 1) {
                const ExitApp = mods[1].ExitApp;
                const exitApp = new ExitApp();
                exitApp.init();
                exitApp.ToHome({});
            } else {
                backCall();
            }
        });
    });
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