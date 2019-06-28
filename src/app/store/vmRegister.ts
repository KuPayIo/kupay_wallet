import { WebViewManager } from '../../pi/browser/webview';
import { register } from './memstore';

const walletName = 'default';
const LISTENERSTORENAME = 'app/postMessage/listenerStore';
const methodName = 'notifyListener';
/**
 * 注册store
 */

export const vmRegisterStore = (key:string) => {
    register(key,(data:any) => {
        WebViewManager.rpc(walletName,{ moduleName:LISTENERSTORENAME,methodName,params:[key,JSON.stringify(data)] });
    });
};