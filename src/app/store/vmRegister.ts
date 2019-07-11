import { WebViewManager } from '../../pi/browser/webview';
import { getAllAccount, getStore, register } from './memstore';

const walletName = 'default';
const LISTENERSTORENAME = 'app/postMessage/listenerStore';
const methodName = 'notifyListener';
/**
 * 注册store
 */
export const vmRegisterStore = (keysStr:string) => {
    console.log('注册vmRegisterStore ===',keysStr);
    const keys = keysStr.split(',');
    for (const key of keys) {         // 一次性注册keys
        register(key,(data:any) => {
            WebViewManager.rpc(walletName,{ moduleName:LISTENERSTORENAME,methodName,params:[key,JSON.stringify(data)] });
        });
    }
};

let firstRegisterSuccess = false;
const firstRegisterCbs = [];
/**
 * 第一次注册监听  (在第一次注册成功后才取登录  保证webview端能监听到登录相关信息)
 */
export const addFirstRegisterListener = (cb:Function) => {
    if (!firstRegisterSuccess) {
        firstRegisterCbs.push(cb);
    } else {
        cb();
    }
};

/**
 * 第一次注册成功
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