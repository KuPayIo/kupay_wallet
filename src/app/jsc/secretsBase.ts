/**
 * 
 */
import { secrets } from './secrets.min';

/**
 * 创建随机私钥
 * @param skeyBits  私钥的位长(int)
 * @return 私钥的16进制字符串
 */
export const createSecret = (skeyBits = 256): string => {
    return secrets.random(skeyBits);
};

/**
 * 共享私钥sKey，返回n个私钥，其中只要有k个私钥，就可以还原
 * @param hex string sKey 共享的私钥
 * @param n 总的私钥数(int)
 * @param k 恢复所需最小私钥数(int)
 * @return 给出共享的n个私钥
 */
export const shareSecret = (sKey, n, k, skeyBits = 256): string[] => {
    return secrets.share(sKey, n, k);
};

/**
 * 通过老的分享和新id，再 创建一个新的共享私钥
 * @param shares 老共享出来的的私钥
 * @param id 新私钥的id(int)
 * @return 新共享的私钥
 */
export const newShareSecret = (shares: string[], id): string => {
    return secrets.newShare(id, shares);
};

/**
 * 通过k个共享私钥，还原原始私钥
 * @param secretKeys 共享私钥数组
 * @return 还原的私钥
 */
export const restoreSecret = (secretKeys: string[]): string => {
    return secrets.combine(secretKeys);
};

/**
 * 这是测试程序
 */
const test = () => {

    const skey = createSecret();

    // shares.length为10，要还原skey，至少需要5个shares的值
    const shares = shareSecret(skey, 10, 5);

    console.log(skey, shares);

    // 仅仅有4个是还原不了的
    let comb = restoreSecret(shares.slice(0, 4));
    console.log(comb === skey); // 肯定是false

    // 5个密钥，可以
    comb = restoreSecret(shares.slice(4, 9));
    console.log(comb === skey); // 肯定是true

    // 10个，也可以
    comb = restoreSecret(shares);
    console.log(comb === skey); // 肯定是true

    // 用id8再创建一个新的共享私钥
    const newShare = newShareSecret(shares, 8);

    // 4个原始私钥，和新的私钥，一共5个，可以还原
    comb = restoreSecret(shares.slice(1, 5).concat(newShare));
    console.log(comb === skey); // 肯定是true
};