/**
 * @file 入口文件，用于登录，唤起hall界面
 * @author henk<speoth@163.com>
 */

import { getStore as chatGetStore } from '../../../chat/client/app/data/store';
import { chatManualReconnect } from '../../../chat/client/app/net/init';
import { earnManualReconnect } from '../../../earn/client/app/net/init';
import { getStore as earnGetStore } from '../../../earn/client/app/store/memstore';
import { addAppBackPressed } from '../../../pi/browser/app_comon_event';
import { ExitApp } from '../../../pi/browser/exitApp';
import { backCall, backList, lastBack, popNew } from '../../../pi/ui/root';
import { addWidget } from '../../../pi/widget/util';
import { callEmitWebviewReload, callWalletManualReconnect, getStoreData } from '../../middleLayer/wrap';
import { LockScreen } from '../../publicLib/interface';
import { getScreenModify, preLoadAd } from '../../viewLogic/native';

// ============================== 导出
export const run = (homePageData,cb): void =>  {
    callEmitWebviewReload();
    addWidget(document.body, 'pi-ui-root');
    // 数据检查  
    // checkUpdate();  
    popNew('app-view-base-app');
    const homeEnter = Date.now() - self.startTime;
    const id = homePageData[0];
    const accounts = homePageData[1];
    if (!id) {
        if (accounts.length > 0) {
            popNew('app-view-base-entrance1',{ accounts });
        } else {
            popNew('app-view-base-entrance');
        }
    } 
         // 锁屏页面
    popNewPage();
    if (cb) cb();
    const timeArrStr = localStorage.getItem('timeArr');
    let timeArr;
    if (timeArrStr) {
        timeArr = JSON.parse(timeArrStr);
    } else {
        timeArr = [];
    }
    timeArr.push({ homeEnter,getData:self.getDataEnd - self.getDataStart });
    localStorage.setItem('timeArr',JSON.stringify(timeArr));
    
    // 预先从底层获取一些数据
    preFetchFromNative();
    // app event 注册
    addAppEvent();
};

/**
 * 界面入口
 */
const popNewPage = () => {
    ifNeedUnlockScreen().then(locked => {
        if (locked) {
            popNew('app-components1-lockScreenPage-lockScreenPage', {
                openApp: true
            });
        }
    });
};

/**
 * 预先从底层获取一些数据
 */
const preFetchFromNative = () => {
    getScreenModify();
        // 预先随机下载
    preLoadAd(undefined,() => {
        preLoadAd(undefined,() => {
            preLoadAd(undefined);
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
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            ifNeedUnlockScreen().then(loccked => {
                if (loccked) {
                    popNew('app-components1-lockScreenPage-lockScreenPage', {
                        openApp: true
                    });
                }
            });

            setTimeout(() => {
                getStoreData('user/isLogin').then(isLogin => {
                    if (!isLogin) {
                        callWalletManualReconnect();
                    }
                });
                    
                if (!chatGetStore('isLogin')) {
                    chatManualReconnect();
                }
                if (!earnGetStore('userInfo/isLogin')) {
                    earnManualReconnect();
                }
            },100);  // 检查是否已经退出登录
        }
    });

    let startTime = 0;
        // 注册appBackPressed
    addAppBackPressed(() => {
        let doubleClick = false;
        const now = new Date().getTime();
        if (now - startTime <= 300) {
            doubleClick = true;
        }
        startTime = now;
        console.log('addActivityBackPressed callback called');
        if (backList.length === 1) {
            if (!doubleClick) return;
            const exitApp = new ExitApp();
            exitApp.init();
            exitApp.ToHome({});
        } else {
            const widget = lastBack();
            const entranceName = 'app-view-base-entrance';
            const entranceName1 = 'app-view-base-entrance1';
            if (widget.name === entranceName || widget.name === entranceName1) return;
            backCall();
        }
    });
};

// ============================== 立即执行

/**
 * 是否需要解锁屏幕
 */
const ifNeedUnlockScreen = async () => {
    const unlockScreen = document.getElementById('keyboard');
    if (unlockScreen) return false;
    const ls: LockScreen = await getStoreData('setting/lockScreen',{});
    const lockScreenPsw = ls.psw;
    const openLockScreen = ls.open !== false;

    return lockScreenPsw && openLockScreen;
};
