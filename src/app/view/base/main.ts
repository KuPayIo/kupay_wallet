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
import { walletManualReconnect } from '../../net/login';
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
    // 解决进入时闪一下问题
    setTimeout(() => {
        if (cb) cb();
    }, 100);
    // tslint:disable-next-line:max-line-length
    // const changellyTempTxs = [{ id:'ztr2b6at2f2fbhf1',hash:undefined },{ id:'ctiub6x781ku12wa',hash:undefined },{ id:'3blkh2bkcxtv53fc',hash:'ae0bfbf0686d81166ff32aeef64d0cd2dc5125bf9f4299242c65bb8db6f772c0' }];
    // setStore('wallet/changellyTempTxs',changellyTempTxs);
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
        if (iType === 'onAppResumed') {
            if (ifNeedUnlockScreen()) {
                popNew('app-components1-lockScreenPage-lockScreenPage', {
                    openApp: true
                });
            }
            setTimeout(() => {
                if (!getStore('user/isLogin')) {
                    walletManualReconnect();
                }
            },100);  // 检查是否已经退出登录
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