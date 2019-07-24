import { WebViewManager } from '../../pi/browser/webview';
import { LoadedStage, PostMessage, PostModule, ServerPushArgs, ThirdCmd } from '../publicLib/interface';

/**
 * 主动向钱包推消息
 */

const walleWebViewtName = 'default'; // 钱包webView name  
/**
 * 推送vm 资源加载相关消息
 */
export const postLoadedMessage = (stage:LoadedStage) => {
    const message:PostMessage = {
        moduleName:PostModule.LOADED,   // 模块名
        args:stage      // 参数
    };
    WebViewManager.postMessage(walleWebViewtName,JSON.stringify(message));
};

/**
 * 推送store准备好
 */
export const postStoreLoadedMessage = () => {
    postLoadedMessage(LoadedStage.STORELOADED);
};

/**
 * 推送所有资源已准备好
 */
export const postAllLoadedMessage = () => {
    postLoadedMessage(LoadedStage.ALLLOADED);
};

/**
 * 推送third 相关
 */
export const postThirdPushMessage = (cmd:ThirdCmd,payload:any) => {
    const message:PostMessage = {
        moduleName:PostModule.THIRD,   // 模块名
        args:{ cmd,payload }      // 参数
    };
    WebViewManager.postMessage(walleWebViewtName,JSON.stringify(message));
};

/**
 * 推送服务器推送 相关
 */
export const postServerPushMessage = (args:ServerPushArgs) => {
    const message:PostMessage = {
        moduleName:PostModule.SERVER,   // 模块名
        args      // 参数
    };
    WebViewManager.postMessage(walleWebViewtName,JSON.stringify(message));
};

let vmStage:LoadedStage = LoadedStage.START;

/**
 * vmStage变化
 * @param firstLoaded 是否是第一次加载
 */
export const setVmStage = (stage:LoadedStage,firstLoaded:boolean = true) => {
    vmStage = stage;
    if (vmStage === LoadedStage.STORELOADED) {
        postStoreLoadedMessage();
    } else if (vmStage === LoadedStage.ALLLOADED) {
        postAllLoadedMessage();
        if (firstLoaded) {
            sourceLoade();
        }
        
    }
};

const sourceLoadedCbs = [];

/**
 * 设置vm loaded监听
 */
export const addSourceLoadedListener = (cb:Function) => {
    if (vmStage === LoadedStage.ALLLOADED) {
        cb();
    } else {
        sourceLoadedCbs.push(cb);
    }
};

/**
 * 获取vmStage
 */
export const getVmStage = () => {
    return vmStage;
};

const sourceLoade = () => {
    for (const cb of sourceLoadedCbs) {
        cb && cb();
    }
};