import { getStore as chatGetStore, register as chatRegister, unregister as chatUnregister } from '../../chat/client/app/data/store';
import { applyToGroup, getChatUid } from '../../chat/client/app/net/rpc';
import { GENERATOR_TYPE } from '../../chat/server/data/db/user.s';
import { WebViewManager } from '../../pi/browser/webview';
import { popNew } from '../../pi/ui/root';
import { popNew3 } from '../utils/tools';
import { getGameItem } from '../view/play/home/gameConfig';
import { logoutWallet } from '../viewLogic/login';

/**
 * 第三方应用调用的基础功能
 * 
 */

// 悬浮框
let popFloatBoxClose;

// 当前打开的webviewName
let curWebviewName;

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

// 退出钱包后关闭悬浮框和游戏
logoutWallet(() => {
    closePopFloatBox();
    if (curWebviewName) {
        closeWebview(curWebviewName);
        curWebviewName = undefined;
    }
});

export const closePopFloatBox = () => {
    popFloatBoxClose && popFloatBoxClose.callback(popFloatBoxClose.widget);
    popFloatBoxClose = undefined ;
};

 /**
  * 关闭打开的webview
  */
export const closeWebview = (webviewName: string) => {
    console.log('wallet closeWebview called');
    WebViewManager.close(webviewName);
};

/**
 * 最小化webview
 */
export const minWebview = (payload:{webviewName: string;popFloatBox:boolean}) => {
    console.log('wallet minWebview called');
    const webviewName = payload.webviewName;
    const popFloatBox = payload.popFloatBox;
    if (popFloatBox) {
        popFloatBoxClose = popNew('app-components-floatBox-floatBox',{ webviewName });
    }
};

/**
 * 最小化webview
 */
export const minWebview1 = (webviewName: string) => {
    console.log('wallet minWebview called');
    curWebviewName = webviewName;
    WebViewManager.minWebView(webviewName);
};

/**
 * 邀请好友
 */
export const inviteFriends = (webviewName: string) => {
    console.log('wallet inviteFriends called');
    const gameItem = getGameItem(webviewName);
    popNew('earn-client-app-view-activity-inviteFriend',{
        bgImg:gameItem.img[2],
        shareUrl:gameItem.apkDownloadUrl,
        okCB:() => {
            WebViewManager.open(webviewName, `${gameItem.url}?${Math.random()}`, webviewName,'');
        }
    });
};

/**
 * 游戏客服
 */
export const gotoGameService = (webviewName: string) => {
    console.log('wallet gotoGameService called');
    if (!chatGetStore('uid') || !chatGetStore('isLogin')) {
        const isLoginCb = (uid:number) => {
            gotoGameService1(webviewName);
            chatUnregister('uid',isLoginCb);
        };
        chatRegister('uid',isLoginCb);
    } else {
        gotoGameService1(webviewName);
    }
};

const gotoGameService1 = (webviewName: string) => {
    const item = getGameItem(webviewName);
    getChatUid(item.accId).then((r) => {
        popNew3('chat-client-app-view-chat-chat',{ id: r,chatType: GENERATOR_TYPE.USER,okCB:() => {
            WebViewManager.open(webviewName, `${getGameItem(webviewName).url}?${Math.random()}`, webviewName,'');
        } });
    });
};

/**
 * 官方群聊
 */
export const gotoOfficialGroupChat = (webviewName: string) => {
    console.log('wallet gotoOfficialGroupChat called');
    if (!chatGetStore('uid') || !chatGetStore('isLogin')) {
        const isLoginCb = (uid:number) => {
            gotoOfficialGroupChat1(webviewName);
            chatUnregister('uid',isLoginCb);
        };
        chatRegister('uid',isLoginCb);
    } else {
        gotoOfficialGroupChat1(webviewName);
    }
};

const gotoOfficialGroupChat1 = (webviewName: string) => {
    const item = getGameItem(webviewName);
    applyToGroup(item.groupId).then((r) => {
        console.log(' applyToGroup success');
        popNew3('chat-client-app-view-chat-chat',{ id: r, chatType: GENERATOR_TYPE.GROUP,okCB:() => {
            WebViewManager.open(webviewName, `${getGameItem(webviewName).url}?${Math.random()}`, webviewName,'');
        } });
    });
};