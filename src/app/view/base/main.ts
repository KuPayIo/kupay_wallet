/**
 * @file 入口文件，用于登录，唤起hall界面
 * @author henk<speoth@163.com>
 */

// tslint:disable-next-line:no-reserved-keywords
declare const module;

import { ExitApp } from '../../../pi/browser/exitApp';
import { backCall, backList, popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { addWidget } from '../../../pi/widget/util';
import { getScreenModify, preLoadAd } from '../../logic/native';
import { LockScreen } from '../../store/interface';
import { getStore, setStore } from '../../store/memstore';
import { fetchDeviceId } from '../../utils/tools';

// ============================== 导出

export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export const run = (cb): void => {
    addWidget(document.body, 'pi-ui-root');
    // 数据检查
    checkUpdate();
    // 打开首页面
    popNew('app-view-base-app');
    // 锁屏页面
    popNewPage();
    // 预先从底层获取一些数据
    preFetchFromNative();
    console.timeEnd('home enter');
    // 后台切前台
    backToFront();
    // setTimeout(() => {
    //     changellyGetStatus().then(res => {
    //         console.log('changellyGetStatus ',res);
    //     });
    //     changellyGetTransactions('ETH','0x313df6d5db1460c099a30ef5f1c1e87636ae08fa').then(res => {
    //         console.log('changellyGetTransactions ',res);
    //     });
        
    // },2000);
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
    // const deviceInfo = getStore('setting/deviceInfo');
    // if (!deviceInfo) {
    //     fetchDeviceInfo().then(info => {
    //         setStore('setting/deviceInfo',info);
    //     });
    // }
    getScreenModify();

    // 预先随机下载
    const adType = undefined;
    preLoadAd(adType,() => {
        preLoadAd(adType,() => {
            preLoadAd(adType);
        });
    });
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