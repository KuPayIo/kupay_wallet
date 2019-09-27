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
