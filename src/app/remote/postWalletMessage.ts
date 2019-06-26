import { WebViewManager } from '../../pi/browser/webview';
import { PostMessage, PostModule } from '../publicLib/interface';

/**
 * 主动向钱包推消息
 */

const walleWebViewtName = 'default'; // 钱包webView name
/**
 * 推送vm 资源加载相关消息
 */
export const postLoadedMessage = () => {
    const message:PostMessage = {
        moduleName:PostModule.LOADED,   // 模块名
        args:true      // 参数
    };
    WebViewManager.postMessage(walleWebViewtName,JSON.stringify(message));
};