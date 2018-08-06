/**
 * 连接管理
 */
import { closeCon, open, request, setUrl } from '../../pi/net/ui/con_mgr';
import { EthWallet } from '../core/eth/wallet';
import { sign } from '../core/genmnemonic';
import { GlobalWallet } from '../core/globalWallet';
import { getCurrentWallet, getLocalStorage, openBasePage } from '../utils/tools';
import { dataCenter } from './dataCenter';

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
 * 货币类型
 */
export enum CurrencyType {
    KT = 100,
    ETH
}

// 枚举货币类型
export const CurrencyTypeReverse  = {
    100:'KT',
    101:'ETH'
};
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
/**
 * 通用的异步通信
 */
export const requestAsync = async (msg: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        request(msg, (resp: any) => {
            if (resp.type) {
                console.log(`错误信息为${resp.type}`);
                reject(resp);
            } else if (resp.result !== undefined) {
                resolve(resp);
            }
        });
    });
};
/**
 * 验证登录的异步通信
 */
export const requestLogined = async (msg: any) => {
    if (loginState === LoginState.logined) {
        return requestAsync(msg);
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
        const res: any = await requestAsync(msgLogin);
        if (res.result === 1) {
            setLoginState(LoginState.logined);

            return requestAsync(msg);
        }
        setLoginState(LoginState.logerror);

        return;
    }

};

/**
 * 开启连接并获取验证随机数
 */
export const openAndGetRandom = async () => {
    const wallets = getLocalStorage('wallets');
    const wallet = getCurrentWallet(wallets);
    if (!wallet) return;
    const oldUser = dataCenter.getUser();
    if (oldUser === wallet.walletId) return;
    if (oldUser) {
        closeCon();
        setLoginState(LoginState.init);
        dataCenter.setUser(wallet.walletId);

        return;
    }

    // setUrl(`ws://120.24.44.254:2081`);
    setUrl(`ws://192.168.33.113:2081`);
    dataCenter.setUser(wallet.walletId);

    return new Promise((resolve, reject) => {
        open(() => {
            const gwlt = GlobalWallet.fromJSON(wallet.gwlt);
            // 连接打开后开始设置账号缓存
            const msg = { type: 'get_random', param: { account: wallet.walletId.slice(2), pk: `04${gwlt.publicKey}` } };
            request(msg, (resp) => {
                if (resp.type) {
                    console.log(`错误信息为${resp.type}`);
                    reject(resp.type);
                } else if (resp.result !== undefined) {
                    dataCenter.setConRandom(resp.rand);
                    resolve(resp);
                }
            });
        }, (result) => {
            console.log(`open错误信息为${result}`);
            reject(result);
        }, () => {
            const gwlt = GlobalWallet.fromJSON(wallet.gwlt);
            // 连接打开后开始设置账号缓存
            const msg = { type: 'get_random', param: { account: wallet.walletId.slice(2), pk: `04${gwlt.publicKey}` } };
            request(msg, (resp) => {
                if (resp.type) {
                    console.log(`错误信息为${resp.type}`);
                    reject(resp.type);
                } else if (resp.result !== undefined) {
                    dataCenter.setConRandom(resp.rand);
                    resolve(resp);
                }
            });
        });
    });

};

/**
 * 获取所有的货币余额
 */
export const getAllBalance = async () => {
    const msg = { type: 'wallet/account@get', param: { list: `[${CurrencyType.KT}, ${CurrencyType.ETH}]` } };

    return requestAsync(msg);
};

/**
 * 获取指定类型的货币余额
 */
export const getBalance = async (currencyType: CurrencyType) => {
    const msg = { type: 'wallet/account@get', param: { list: `[${currencyType}]` } };

    return requestAsync(msg);
};

/**
 * 获取分红信息
 */
export const getDividend = async() => {
    const msg = { type:'wallet/cloud@get_bonus_info', param:{} };
    
    return requestAsync(msg);
};

/**
 * 获取挖矿总信息
 */
export const getMining = async() => {
    const msg = { type:'wallet/cloud@get_mine_total',param:{} };

    return requestAsync(msg);
};