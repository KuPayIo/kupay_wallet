import { request } from '../../pi/net/ui/con_mgr';
import { setStore } from '../store/memstore';

/**
 * 登录
 */

// 1111
/**
 * 通用的异步通信
 */
export const requestAsync = (msg: any):Promise<any> => {
    return new Promise((resolve, reject) => {
        request(msg, (resp: any) => {
            if (resp.type) {
                console.log(`错误信息为${resp.type}`);
                reject(resp);
            } else if (resp.result !== 1) {
                reject(resp);
            } else {
                resolve(resp);
            }
        });
    });
};

// 钱包登录
export const walletLogin = (cb:Function) => {
    (<any>window).pi_sdk.api.authorize({ appId:101 },(err, result) => {
        console.log('authorize',err,JSON.stringify(result));
        if (err === 0) { // 网络未连接
            console.log('网络未连接');
        } else {
            console.log('钱包登录成功',result);
            setStore('user/info',result);
            cb();
        }
    });
};

// 用户登出回调
const logoutCallbackList:Function[] = [];

/**
 * 登出钱包
 */
export const logoutWallet = (success:Function) => {
    logoutCallbackList.push(success);
};

/**
 * 钱包登出成功
 */
export const logoutWalletSuccess =  () => {
    for (const logout of logoutCallbackList) {
        logout();
    }
};