import { applyGameServer, applyToGroup } from '../../chat/client/app/net/rpc';
import { GENERATOR_TYPE } from '../../chat/server/data/db/user.s';
import { WebViewManager } from '../../pi/browser/webview';
import { popNew } from '../../pi/ui/root';
import { getGameItem } from '../view/play/home/gameConfig';

/**
 * 第三方应用调用的基础功能
 * 
 */

 /**
  * 关闭打开的webview
  */
export const closeWebview = (webViewName: string) => {
    console.log('wallet closeWebview called');
    WebViewManager.close(webViewName);
};

/**
 * 最小化webview
 */
export const minWebview = (webViewName: string) => {
    console.log('wallet minWebview called');
    const close = popNew('app-components-floatBox-floatBox',{ webViewName });
    WebViewManager.minWebView(webViewName);

    return close;
};

/**
 * 邀请好友
 */
export const inviteFriends = (webViewName: string) => {
    console.log('wallet inviteFriends called');
    const close = minWebview(webViewName);
    popNew('earn-client-app-view-activity-inviteFriend',undefined,() => {
        WebViewManager.open(webViewName, `${getGameItem(webViewName).url}?${Math.random()}`, webViewName,'');
        console.log('inviteFriends =======',close);
    });
   
};

/**
 * 去充值
 */
export const gotoRecharge = (webViewName: string) => {
    console.log('wallet gotoRecharge called');
    popNew('app-view-wallet-cloudWalletSC-rechargeSC',undefined,() => {
        WebViewManager.open(webViewName, `${getGameItem(webViewName).url}?${Math.random()}`, webViewName,'');
    });
    minWebview(webViewName);
};

/**
 * 游戏客服
 */
export const gotoGameService = (webViewName: string) => {
    console.log('wallet gotoGameService called');
    const item = getGameItem(webViewName);
    applyGameServer(item.uid).then((r) => {
        popNew('chat-client-app-view-chat-chat',{ id: r,chatType: GENERATOR_TYPE.USER });
    });
    minWebview(webViewName);
};

/**
 * 官方群聊
 */
export const gotoOfficialGroupChat = (webViewName: string) => {
    console.log('wallet gotoOfficialGroupChat called');
    const item = getGameItem(webViewName);
    applyToGroup(item.gid).then(() => {
        popNew('chat-client-app-view-chat-chat',{ id: item.gid, chatType: GENERATOR_TYPE.GROUP });
    });
    minWebview(webViewName);
};