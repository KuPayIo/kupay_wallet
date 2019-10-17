/**
 * @file 入口文件，用于登录，唤起hall界面
 * @author henk<speoth@163.com>
 */

import { getStore as chatGetStore } from '../../../chat/client/app/data/store';
import { chatManualReconnect } from '../../../chat/client/app/net/init';
import { earnManualReconnect } from '../../../earn/client/app/net/init';
import { getStore as earnGetStore } from '../../../earn/client/app/store/memstore';
import { addActivityBackPressed, addAppBackPressed } from '../../../pi/browser/app_comon_event';
import { ExitApp } from '../../../pi/browser/exitApp';
import { initReport } from '../../../pi/collection/collection';
import { backCall, backList, lastBack, popNew } from '../../../pi/ui/root';
import { addWidget } from '../../../pi/widget/util';
import { sourceIp } from '../../public/config';
import { LockScreen } from '../../public/interface';
import { getStore } from '../../store/memstore';
import { getScreenModify } from '../../utils/native';

// ============================== 导出
export const run = (cb): void =>  {
    addWidget(document.body, 'pi-ui-root');
    initReport({
        reported:true,
        interval:10 * 1000,
        deadline:30 * 1000,
        ip:sourceIp
    });
    // 数据检查  
    checkUpdate();  
    getScreenModify();
    // const id = getStore('user/info/openid');
    popNew('app-view-base-app');
    // if (!id) {
    //     popNew('app-view-base-entrance');
    // } 
    // 锁屏页面;
    // popNewPage();
    if (cb) cb();
    
    // 预先从底层获取一些数据
    // preFetchFromNative();
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

// /**
//  * 预先从底层获取一些数据
//  */
// const preFetchFromNative = () => {
//     getScreenModify();
//         // 预先随机下载
//     preLoadAd(undefined,() => {
//         preLoadAd(undefined,() => {
//             preLoadAd(undefined);
//         });
//     });
// };
const checkUpdate = () => {
  // todo 
};
let lastVisibilityState;
/**
 * 注册app event
 */
const addAppEvent = () => {
    document.addEventListener('visibilitychange', () => {
        const curVisibilityState = document.visibilityState;
        console.log('visibilityState = ',document.visibilityState);
        // 这里有可能同时触发两次document.visibilityState === 'visible',导致会弹出两个锁屏页面
        if (curVisibilityState !== lastVisibilityState) {
            lastVisibilityState = curVisibilityState;
            if (curVisibilityState === 'visible') {  
                ifNeedUnlockScreen().then(loccked => {
                    if (loccked && !getHasEnterGame()) {
                        popNew('app-components1-lockScreenPage-lockScreenPage', {
                            openApp: true
                        });
                    }
                    setHasEnterGame(false);
                });
    
                setTimeout(() => {
                    // TODO 钱包登录
                    if (!chatGetStore('isLogin')) {
                        chatManualReconnect();
                    }
                    if (!earnGetStore('userInfo/isLogin')) {
                        earnManualReconnect();
                    }
                },100);  // 检查是否已经退出登录
            }
        } else {
            lastVisibilityState = undefined;
        }
        
    });

    let startTime = 0;
        // 注册appBackPressed
    // 处理物理返回事件
    addActivityBackPressed(() => {
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
    const ls: LockScreen = await getStore('setting/lockScreen',{});
    const lockScreenPsw = ls.psw;
    const openLockScreen = ls.open !== false;

    return lockScreenPsw && openLockScreen;
};

let hasEnterGame = false;   // 是否进入游戏  锁屏判断是否从游戏退出，是就不展示锁屏界面

/**
 * 设置hasEnterGame
 */
export const setHasEnterGame = (entered:boolean) => {
    hasEnterGame = entered;
};

/**
 * 获取hasEnterGame
 */
export const getHasEnterGame = () => {
    return hasEnterGame;
};