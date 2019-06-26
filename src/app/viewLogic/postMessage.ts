import { WebViewManager } from '../../pi/browser/webview';
import { PostMessage, PostModule } from '../publicLib/interface';
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
        emitVmLoaded(msg.args);
    }
});
