
/**
 * 和账号相关的工具
 */
import { getStore, setStore } from '../store/memstore';
import { getStrLen } from './tools';

/**
 * 钱包名称是否合法
 * @param walletName wallet name
 */
export const walletNameAvailable = (walletName) => {
    
    return getStrLen(walletName.trim()) >= 1 && getStrLen(walletName.trim()) <= 20;
};

/**
 * 修改钱包名称
 * @param walletName wallet name
 */
export const changeWalletName = (walletName:string) => {
    const userInfo = getStore('user/info');
    userInfo.nickName = walletName;
    setStore('user/info', userInfo);
};

/**
 * 钱包密码是否合乎规则
 * @param walletPsw  wallet password
 */
export const walletPswAvailable = (walletPsw:string) => {
    const reg = /^[.@$&*#a-zA-Z0-9]{8,}$/;

    return reg.test(walletPsw.trim());
};

/**
 * 判断密码是否相等
 * @param psw1 password one
 * @param psw2 password two
 */
export const pswEqualed = (psw1, psw2) => {
    if (!psw1 || !psw2) return false;
    
    return psw1.trim() === psw2.trim();
};

/**
 * 名字显示截取
 */
export const nickNameInterception = (name: string): string => {
    let ret = '';
    if (name.length > 6) {
        ret = `${name.slice(0, 6)}...`;
    } else {
        ret = name;
    }

    return ret;
};
