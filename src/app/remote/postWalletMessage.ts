import { WebViewManager } from '../../pi/browser/webview';
import { PostMessage, PostModule, ThirdCmd } from '../publicLib/interface';

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

/**
 * 推送third 相关
 */
export const postThirdPushMessage = (cmd:ThirdCmd) => {
    const message:PostMessage = {
        moduleName:PostModule.THIRD,   // 模块名
        args:cmd      // 参数
    };
    WebViewManager.postMessage(walleWebViewtName,JSON.stringify(message));
};