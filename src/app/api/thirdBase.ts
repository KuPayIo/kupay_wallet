import { WebViewManager } from '../../pi/browser/webview';
import { popNew } from '../../pi/ui/root';
import { getGameUrl } from '../view/play/home/gameConfig';

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
    popNew('app-components-floatBox-floatBox',{ webViewName });
    WebViewManager.minWebView(webViewName);
    
};

/**
 * 邀请好友
 */
export const inviteFriends = (webViewName: string) => {
    console.log('wallet inviteFriends called');
    popNew('earn-client-app-view-activity-inviteFriend',undefined,() => {
        WebViewManager.open(webViewName, `${getGameUrl(webViewName)}?${Math.random()}`, webViewName,'');
    });
    minWebview(webViewName);
};

/**
 * 去充值
 */
export const gotoRecharge = (webViewName: string) => {
    console.log('wallet gotoRecharge called');
    popNew('app-view-wallet-cloudWalletGT-rechargeGT',undefined,() => {
        WebViewManager.open(webViewName, `${getGameUrl(webViewName)}?${Math.random()}`, webViewName,'');
    });
    minWebview(webViewName);
};

/**
 * 游戏客服
 */
export const gotoGameService = (webViewName: string) => {
    console.log('wallet gotoGameService called');
    minWebview(webViewName);
};

/**
 * 官方群聊
 */
export const gotoOfficialGroupChat = (webViewName: string) => {
    console.log('wallet gotoOfficialGroupChat called');
    minWebview(webViewName);
};