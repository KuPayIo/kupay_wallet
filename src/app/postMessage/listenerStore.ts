import { WebViewManager } from '../../pi/browser/webview';
import { vmName } from '../middleLayer/wrap';

/**
 * 监听store
 */

const handlerMap = new Map();

const VMREGISTERSTORE = 'app/store/vmRegister';

const methodName = 'vmRegisterStore';
/**
 * 注册监听函数
 */
export const addStoreListener = (key:string,cb:Function) => {
    const handlers = handlerMap.get(key) || [];
    if (handlers.length === 0) {   // 当前key还从未被注册过
        WebViewManager.rpc(vmName,{ moduleName:VMREGISTERSTORE,methodName,params:[key] });
    }
    handlers.push(cb);
    handlerMap.set(key,handlers);
};

/**
 * 通知监听器
 */
export const notifyListener = (key:string,data:string) => {
    data = JSON.parse(data);
    const handlers = handlerMap.get(key) || [];
    for (const h of handlers) {
        h && h(data);
    }
};