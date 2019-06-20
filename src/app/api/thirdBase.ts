import { applyToGroup, getChatUid } from '../../chat/client/app/net/rpc';
import { GENERATOR_TYPE } from '../../chat/server/data/db/user.s';
import { WebViewManager } from '../../pi/browser/webview';
import { popNew } from '../../pi/ui/root';
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
    minWebview1(webviewName);
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
    minWebview1(webviewName);
};

/**
 * 去充值
 */
export const gotoRecharge = (webviewName: string) => {
    console.log('wallet gotoRecharge called');
    popNew('app-view-wallet-cloudWalletCustomize-rechargeSC',{
        okCB:() => {
            WebViewManager.open(webviewName, `${getGameItem(webviewName).url}?${Math.random()}`, webviewName,'');
        }
    });
    minWebview1(webviewName);
};

/**
 * 游戏客服
 */
export const gotoGameService = (webviewName: string) => {
    console.log('wallet gotoGameService called');
    const item = getGameItem(webviewName);
    getChatUid(item.accId).then((r) => {
        popNew('chat-client-app-view-chat-chat',{ id: r,chatType: GENERATOR_TYPE.USER,okCB:() => {
            WebViewManager.open(webviewName, `${getGameItem(webviewName).url}?${Math.random()}`, webviewName,'');
        } });
    });
    minWebview1(webviewName);
};

/**
 * 官方群聊
 */
export const gotoOfficialGroupChat = (webviewName: string) => {
    console.log('wallet gotoOfficialGroupChat called');
    const item = getGameItem(webviewName);
    applyToGroup(item.groupId).then((r) => {
        popNew('chat-client-app-view-chat-chat',{ id: r, chatType: GENERATOR_TYPE.GROUP,okCB:() => {
            WebViewManager.open(webviewName, `${getGameItem(webviewName).url}?${Math.random()}`, webviewName,'');
        } });
    });
    minWebview1(webviewName);
};