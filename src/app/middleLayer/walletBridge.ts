import { createWalletRandom } from '../jsc/jscWallet';
import { CreateWalletOption } from '../store/interface';

/**
 * 钱包相关
 */

/**
 * 随机创建钱包
 */
export const callCreateWalletRandom = (option: CreateWalletOption,tourist?:boolean):Promise<any> => {
    return createWalletRandom(option,tourist);
};