/**
 * 监听VM的store变化
 */
import { WebViewManager } from '../../pi/browser/webview';
import { addStoreLoadedListener } from './vmPush';

/**
 * 注册store监听 VM准备好后执行
 */
export const registerStoreData = (keyName: string, cb: Function) => {
    addStoreLoadedListener(() => {
        addStoreListener(keyName,cb);
    });
};

const handlerMap = new Map();
const registerKeys = [];
let frameId;

/**
 * 注册监听函数
 */
export const addStoreListener = (key:string,cb:Function) => {
    const handlers = handlerMap.get(key) || [];
    if (handlers.length === 0) {   // 当前key还从未被注册过
        registerKeys.push(key);   // 一次性注册的key
    }
    handlers.push(cb);
    handlerMap.set(key,handlers);
    if (!frameId && registerKeys.length > 0) {
        frameId = requestAnimationFrame(() => {   // 在下一帧之前一次性注册所有key
            const keysStr = registerKeys.join(',');
            WebViewManager.rpc('JSVM',{ 
                moduleName:'app/remote/vmApi', 
                methodName:'vmRegisterStore', 
                params:[keysStr] 
            });
            registerKeys.length = 0;
            frameId = undefined;
        }); 
    }
    
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
