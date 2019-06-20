import { WebViewManager } from '../../pi/browser/webview';
import { PostMessage } from '../publicLib/interface';

/**
 * vm 推送消息
 */

 /**
  * 监听postMessage
  */
WebViewManager.addPostMessageListener((fromWebView:string, message:string) => {
    const msg:PostMessage = JSON.parse(message);
    console.log('postMessage ===',msg);
});