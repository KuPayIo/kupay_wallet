/**
 * 钱包向 VM 通信调用的方法
 */
import { WebViewManager } from '../../pi/browser/webview';
import { addStoreLoadedListener } from '../postMessage/vmPush';

let count = 0;
const obj = {};
/**
 * vm rpc 调用
 * rpc调用有两种模式 callback放在rpc函数调用最后面实现对同步函数的rpc调用  放置rpcData 下params参数最后面实现对异步函数的rpc调用
 * @param data 参数 
 */
export const vmRpcCall = (methodName:string,params: any[]):Promise<any> => {
    count++;
    console.log(`vmRpcCall start methodName ${methodName} params ${JSON.stringify(params)} count ${count}`);
    
    return new Promise((resolve,reject) => {
        addStoreLoadedListener(() => {
            let count = obj[methodName] || 0;
            obj[methodName] = ++count;
            // 在params后面加入callback函数  实现对异步函数的rpc调用
            params.push(([error,res]) => { 
                if (error) reject(error);
                resolve(res);
            });
            WebViewManager.rpc('JSVM',{ 
                moduleName:'app/remote/vmApi', 
                methodName, 
                params
            });
        });
        
    });
};

/**
 * 获取store数据
 */
export const getStoreData = (path: string,defaultValue?:any) => {
    return vmRpcCall('getStoreData',[path, defaultValue]);
};

/**
 * 更新store并通知
 */
export const setStoreData = (path: string, data: any, notified = true) => {
    return vmRpcCall('setStoreData',[path,data,notified]);
};

/**
 * 清除用户信息
 */
export const clearUser = () => {
    return vmRpcCall('clearUser',[]);
};

/**
 * websocket请求
 */
export const requestAsyncRpc = (msg: any) => {
    return vmRpcCall('requestAsyncRpc',[msg]);
};

/**
 * 去充值
 */
export const goRecharge = () => {
    return vmRpcCall('goRecharge',[]);
};