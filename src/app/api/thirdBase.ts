import { GENERATOR_TYPE } from '../../chat/server/data/db/user.s';
import { screenMode, WebViewManager } from '../../pi/browser/webview';
import { popNew } from '../../pi/ui/root';
import { logoutWallet } from '../net/login';
import { getGameItem } from '../view/play/home/gameConfig';

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
/**
 * 关闭悬浮框
 */
export const closePopFloatBox = () => {
    popFloatBoxClose && popFloatBoxClose.callback(popFloatBoxClose.widget);
    popFloatBoxClose = undefined;
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
    WebViewManager.minWebView(webviewName,screenMode.portrait);
};

/**
 * 邀请好友
 */
export const inviteFriends = (webviewName: string) => {
    console.log('wallet inviteFriends called');
    const gameItem = getGameItem(webviewName);
    popNew('earn-client-app-view-activity-inviteFriend',{
        bgImg:gameItem.img[2],
        shareUrl:gameItem.apkDownloadUrl
    },() => {
        WebViewManager.open(webviewName, `${gameItem.url}?${Math.random()}`, webviewName,'', screenMode.landscape);
    });
    minWebview1(webviewName);
};

/**
 * 去充值
 */
export const gotoRecharge = (webviewName: string) => {
    console.log('wallet gotoRecharge called');
    popNew('app-view-wallet-cloudWalletCustomize-rechargeSC',null,() => {
        WebViewManager.open(webviewName, `${getGameItem(webviewName).url}?${Math.random()}`, webviewName,'', screenMode.landscape);
    });
    minWebview1(webviewName);
};

/**
 * 游戏客服
 */
export const gotoGameService = (webviewName: string) => {
    console.log('wallet gotoGameService called');
    const item:any = getGameItem(webviewName);
    // getChatUid(item.accId).then((r) => {
    popNew('chat-client-app-view-chat-chat',{ accId:item.accId,chatType: GENERATOR_TYPE.USER,name:`${item.title.zh_Hans}官方客服`,okCB:() => {
        WebViewManager.open(webviewName, `${getGameItem(webviewName).url}?${Math.random()}`, webviewName,'', screenMode.landscape);
    } });
    // });
    minWebview1(webviewName);
};

/**
 * 官方群聊
 */
export const gotoOfficialGroupChat = (webviewName: string) => {
    console.log('wallet gotoOfficialGroupChat called');
    const item:any = getGameItem(webviewName);
    // applyToGroup(item.groupId).then((r) => {
    popNew('chat-client-app-view-chat-chat',{ gid:item.groupId, chatType: GENERATOR_TYPE.GROUP,name:`${item.title.zh_Hans}官方群`,okCB:() => {
        WebViewManager.open(webviewName, `${getGameItem(webviewName).url}?${Math.random()}`, webviewName,'', screenMode.landscape);
    } });    
    // });
    minWebview1(webviewName);
};