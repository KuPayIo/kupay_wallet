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
    WebViewManager.close(webViewName);
};

/**
 * 最小化webview
 */
export const minWebview = (webViewName: string) => {
    WebViewManager.minWebView(webViewName);
    console.log('wallet minWebview called');
};

/**
 * 邀请好友
 */
export const inviteFriends = (webViewName: string) => {
    popNew('earn-client-app-view-activity-inviteFriend',undefined,() => {
        WebViewManager.open(webViewName, `${getGameUrl(webViewName)}?${Math.random()}`, webViewName,'');
    });
    minWebview(webViewName);
};

/**
 * 去充值
 */
export const gotoRecharge = (webViewName: string) => {
    popNew('app-view-wallet-cloudWalletGT-rechargeGT',undefined,() => {
        WebViewManager.open(webViewName, `${getGameUrl(webViewName)}?${Math.random()}`, webViewName,'');
    });
    minWebview(webViewName);
};