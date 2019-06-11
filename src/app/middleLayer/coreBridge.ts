import { VerifyIdentidy } from '../utils/walletTools';

/**
 * core 对应的 bridge
 */

/**
 * 验证当前账户身份
 * @param passwd 密码
 */
export const callVerifyIdentidy = (passwd:string) => {
    return new Promise((resolve) => {
        VerifyIdentidy(passwd).then(hash => {
            resolve(hash);
        });
    });
};
