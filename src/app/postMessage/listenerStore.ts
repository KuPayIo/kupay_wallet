import { WebViewManager } from '../../pi/browser/webview';
import { vmName } from '../middleLayer/wrap';

/**
 * 监听store
 */

const handlerMap = new Map();

const VMREGISTERSTORE = 'app/store/vmRegister';

const registerMethodName = 'vmRegisterStore';
const emitFirstRegisterMethodName = 'emitFirstRegister';

const registerKeys = [];

let frameId;

let firstRegisterSuccess = false; 
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
    if (!frameId) {
        frameId = requestAnimationFrame(() => {   // 在下一帧之前一次性注册所有key
            const keysStr = registerKeys.join(',');
            WebViewManager.rpc(vmName,{ moduleName:VMREGISTERSTORE,methodName:registerMethodName,params:[keysStr] },() => {
                if (!firstRegisterSuccess) { // 通知vm第一次注册成功
                    console.log('第一次注册成功');
                    WebViewManager.rpc(vmName,{ moduleName:VMREGISTERSTORE,methodName:emitFirstRegisterMethodName,params:[] });
                }
                firstRegisterSuccess = true;
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