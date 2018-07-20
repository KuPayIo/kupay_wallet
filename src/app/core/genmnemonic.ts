/**
 * Generate the same mnemonics
 */

import { LANGUAGE } from './btc/wallet';
import { Mnemonic } from './thirdparty/bip39';
import { Web3 } from './thirdparty/web3.min';

export const generate = (language: LANGUAGE, strength: number): string => {
    if (strength < 128 && strength % 32 !== 0) {
        throw new Error('Strength should be greater or equal to 128 and divided by 32');
    }

    const mn = new Mnemonic(language);

    return mn.generate(strength);
};

/**
 * 获取系统随机值
 */
export const generateRandomValues = (strength: number): Uint8Array => {
    if (strength < 128 && strength % 32 !== 0) {
        throw new Error('Strength should be greater or equal to 128 and divided by 32');
    }

    strength = strength || 128;
    const r = strength % 32;
    if (r > 0) {
        throw new Error(`Strength should be divisible by 32, but it is not (${r}).`);
    }
    const hasStrongCrypto = 'crypto' in window && window.crypto !== null;
    if (!hasStrongCrypto) {
        throw new Error('Mnemonic should be generated with strong randomness, but crypto.getRandomValues is unavailable');
    }
    const buffer = new Uint8Array(strength / 8);

    return <Uint8Array>crypto.getRandomValues(buffer);
};
/**
 * 随机值转助记词
 * @param language 语言
 * @param randomValues 随机数
 */
export const toMnemonic = (language: LANGUAGE, randomValues: Uint8Array): string => {
    const mn = new Mnemonic(language);

    return mn.toMnemonic(randomValues);
};

/**
 * 助记词转种子
 * @param language 语言
 * @param mnemonic 助记词
 */
export const toSeed = (language: LANGUAGE, mnemonic: string): string => {
    const mn = new Mnemonic(language);

    return mn.toSeed(mnemonic);
};

/**
 * 通过固定hash生成助记词
 */
export const generateByHash = (hash: string): Uint8Array => {
    if (hash.length % 32 !== 0) {
        throw new Error('Strength should be greater or equal to 128 and divided by 32');
    }

    return str2arr(hash);
};

/**
 * sha3加密
 * 
 * @param str 数据
 */
export const sha3 = (str: string, isHex: boolean) => {
    const web3 = new Web3();
    if (isHex) {
        return web3.sha3(str, { encoding: 'hex' }).slice(2);
    } else {
        return web3.sha3(str).slice(2);
    }
};

/**
 * 字符串转u8Arr
 * 
 * @param str 输入字符串
 */
const str2arr = (str) => {
    const buf = new ArrayBuffer(str.length / 2); // 2 bytes for each char
    const bufView = new Uint8Array(buf);
    for (let i = 0; i < str.length / 2; i++) {
        bufView[i] = ((str.charCodeAt(i * 2) & 0xff) << 8) | ((str.charCodeAt(i * 2 + 1) & 0xff));
    }

    return new Uint8Array(buf);
};
