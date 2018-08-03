import { request } from '../../pi/net/ui/con_mgr';
import { EthWallet } from '../core/eth/wallet';
import { sign } from '../core/genmnemonic';
import { GlobalWallet } from '../core/globalWallet';
import { getCurrentWallet, getLocalStorage, openBasePage } from '../utils/tools';
import { dataCenter } from './dataCenter';

/**
 * 连接管理
 */

/**
 * 枚举登录状态
 */
export enum LoginState {
    init = 0,
    logining,
    logined,
    relogining,
    logouting,
    logouted,
    logerror
}
/**
 * 登录状态
 */
let loginState: number = LoginState.init;

// 设置登录状态
const setLoginState = (s: number) => {
    if (loginState === s) {
        return;
    }
    loginState = s;
};
export const requestAsync = async (msg: any) => {
    return new Promise((resolve,reject) => {
        request(msg, (resp:any) => {
            if (resp.type) {
                console.log(`错误信息为${resp.type}`);
                reject(resp.type);
            } else if (resp.result !== undefined) {
                console.log(resp.result);
                resolve(resp);
            }
        });
    });
}; 

export const requestLogined = async (msg:any) => {
    if (loginState === LoginState.logined) {
        return new Promise((resolve,reject) => {
            request(msg, (resp:any) => {
                if (resp.type) {
                    console.log(`错误信息为${resp.type}`);
                    reject(resp.type);
                } else if (resp.result !== undefined) {
                    console.log(resp.result);
                    resolve(resp);
                }
            });
        });
    } else {
        const wallets = getLocalStorage('wallets');
        const wallet = getCurrentWallet(wallets);
        let passwd = '';
        if (!dataCenter.getHash(wallet.walletId)) {
            passwd = await openBasePage('app-components-message-messageboxPrompt', {
                title: '输入密码', content: '', inputType: 'password'
            });
        }
        const wlt: EthWallet = await GlobalWallet.createWlt('ETH', passwd, wallet, 0);
        const signStr = sign(dataCenter.getConRandom(), wlt.exportPrivateKey());
        const msgLogin = { type: 'login', param: { sign: signStr } };
        setLoginState(LoginState.logining);
        const res:any = await requestAsync(msgLogin);
        if (res.result === 1) {
            setLoginState(LoginState.logined);

            return new Promise((resolve,reject) => {
                request(msg, (resp:any) => {
                    if (resp.type) {
                        console.log(`错误信息为${resp.type}`);
                        reject(resp.type);
                    } else if (resp.result !== undefined) {
                        console.log(resp.result);
                        resolve(resp);
                    }
                });
            });
        }
        setLoginState(LoginState.logerror);

        return;
    }

};