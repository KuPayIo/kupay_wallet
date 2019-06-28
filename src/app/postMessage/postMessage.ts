import { WebViewManager } from '../../pi/browser/webview';
import { LoadedStage, PostMessage, PostModule, ServerPushArgs, ThirdCmd } from '../publicLib/interface';
import { emitServerPush } from './serverPush';
import { emitThirdPush } from './thirdPush';
import { emitVmLoaded } from './vmLoaded';

/**
 * vm 推送消息
 */

 /**
  * 监听postMessage
  */
WebViewManager.addPostMessageListener((fromWebView:string, message:string) => {
    const msg:PostMessage = JSON.parse(message);
    console.log('postMessage ===',msg);
    if (msg.moduleName === PostModule.LOADED) {
        emitVmLoaded(<LoadedStage>msg.args);
    } else if (msg.moduleName === PostModule.SERVER) {
        emitServerPush(<ServerPushArgs>msg.args);
    } else if (msg.moduleName === PostModule.THIRD) {
        emitThirdPush(<ThirdCmd>msg.args);
    }
});
