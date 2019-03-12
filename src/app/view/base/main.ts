/**
 * @file 入口文件，用于登录，唤起hall界面
 * @author henk<speoth@163.com>
 */

// tslint:disable-next-line:no-reserved-keywords
declare const module;

import { addAppBackPressed, addAppResumed } from '../../../pi/browser/app_comon_event';
import { ExitApp } from '../../../pi/browser/exitApp';
import { backCall, backList, popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { addWidget } from '../../../pi/widget/util';
import { getScreenModify, preLoadAd } from '../../logic/native';
import { LockScreen } from '../../store/interface';
import { getStore, setStore } from '../../store/memstore';
import { piRequire } from '../../utils/commonjsTools';
import { fetchDeviceId } from '../../utils/tools';

// ============================== 导出
declare var pi_modules;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export const run = (cb): void =>  {
    addWidget(document.body, 'pi-ui-root');
    // 数据检查
    checkUpdate();
    // 打开首页面
    popNew('app-view-base-app');
    if (!getStore('user/id')) {
        popNew('app-view-base-entrance');
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
        console.log('addActivityBackPressed callback called');
        if (backList.length === 1) {
            const exitApp = new ExitApp();
            exitApp.init();
            exitApp.ToHome({});
        } else {
            backCall();
        }
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