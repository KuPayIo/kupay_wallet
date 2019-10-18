/**
 * 钱包提供给第三方的方法
 */
import { addThirdPushListener } from "../postMessage/thirdPush";
import { popNew } from "../../pi/ui/root";
import { WebViewManager } from "../../pi/browser/webview";
import { PostMessage, PostModule, ThirdCmd } from "../public/constant";


/**
 * 监听第三方发送的请求
 */
addThirdPushListener(ThirdCmd.MIN,(payload:{webviewName: string;popFloatBox:boolean}) => { minWebview(payload); });        // 最小化
addThirdPushListener(ThirdCmd.GAMESERVICE,(webviewName:string) => { gotoGameService(webviewName); });                       // 注册游戏客服事件
addThirdPushListener(ThirdCmd.OFFICIALGROUPCHAT,(webviewName:string) => { gotoOfficialGroupChat(webviewName); });           // 注册官方群聊事件


// 悬浮框
let popFloatBoxClose;

// 当前打开的webviewName
let curWebviewName;

/**
 * 最小化webview
 */
export const minWebview = (payload:{webviewName: string,popFloatBox:boolean}) => {
    console.log('wallet minWebview called');
    const webviewName = payload.webviewName;
    const popFloatBox = payload.popFloatBox;
    if (popFloatBox) {
        popFloatBoxClose = popNew('app-components-floatBox-floatBox',{ webviewName });
    }
    curWebviewName = webviewName;
    WebViewManager.minWebView(webviewName);
};



/**
 * 游戏客服
 */
export const gotoGameService = (webviewName: string) => {
    console.log('wallet gotoGameService called');
    minWebview({webviewName, popFloatBox:false});
    const message:PostMessage = {
        moduleName:PostModule.THIRD,   // 模块名
        args:{ cmd:ThirdCmd.GAMESERVICE, payload:webviewName }      // 参数
    };
    WebViewManager.postMessage(webviewName,JSON.stringify(message));
};

/**
 * 官方群聊
 */
export const gotoOfficialGroupChat = (webviewName: string) => {
    console.log('wallet gotoOfficialGroupChat called');
    minWebview({webviewName, popFloatBox:false});
    const message:PostMessage = {
        moduleName:PostModule.THIRD,   // 模块名
        args:{ cmd:ThirdCmd.OFFICIALGROUPCHAT, payload:webviewName }      // 参数
    };
    WebViewManager.postMessage(webviewName,JSON.stringify(message));
};
