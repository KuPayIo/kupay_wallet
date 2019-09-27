import { WebViewManager } from '../../pi/browser/webview';
import { getAllAccount, getStore, register } from './memstore';

const walletName = 'default';
const LISTENERSTORENAME = 'app/postMessage/listenerStore';
const methodName = 'notifyListener';
const registerKeys = {};
/**
 * 注册store
 */
export const vmRegisterStore = (keysStr:string) => {
    console.log('注册vmRegisterStore ===',keysStr);
    const keys = keysStr.split(',');
    for (const key of keys) {         // 一次性注册keys
        if (!registerKeys[key]) {  // 防止重复注册
            register(key,(data:any) => {
                WebViewManager.rpc(walletName,{ moduleName:LISTENERSTORENAME,methodName,params:[key,JSON.stringify(data)] });
            });
            registerKeys[key] = true;
        }
    }
};

let firstRegisterSuccess = false;
const firstRegisterCbs = [];
/**
 * 监听VM准备完成 保证webview端能监听到登录相关信息
 */
export const registerVmComplete = (cb:Function) => {
    if (!firstRegisterSuccess) {
        firstRegisterCbs.push(cb);
    } else {
        cb();
    }
};

/**
 * VM准备完成 执行回调
 */
export const emitFirstRegister = () => {
    firstRegisterSuccess = true;
    for (const cb of firstRegisterCbs) {
        cb && cb();
    }
};

let homePageDataGeted = false;
const homePageDataGetedCbs = [];
/**
 * 获取首页登录所需数据
 */
export const getHomePageEnterData = () => {
    return getAllAccount().then(accounts => {
        setTimeout(() => {
            emitGetHomePageEnterData();
        },17);
        
        return [getStore('user/id'),accounts];
    });
};

/**
 * 注册获取首页数据监听
 */
export const addGetHomePageEnterDataListener = (cb:Function) => {
    if (homePageDataGeted) {
        cb();
    } else {
        homePageDataGetedCbs.push(cb);
    }
    
};

/**
 * 触发获取首页数据
 */
export const emitGetHomePageEnterData = () => {
    homePageDataGeted = true;
    for (const cb of homePageDataGetedCbs) {
        cb && cb();
    }
};