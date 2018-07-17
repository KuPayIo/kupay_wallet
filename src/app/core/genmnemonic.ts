/**
 * Generate the same mnemonics
 */

import { LANGUAGE } from './btc/wallet';
import { Mnemonic } from './thirdparty/bip39';

export const generate = (language: LANGUAGE, strength: number): string => {
    if (strength < 128 && strength % 32 !== 0) {
        throw new Error('Strength should be greater or equal to 128 and divided by 32');
    }
    const mn = new Mnemonic(language);

    return mn.generate(strength);
};

export const toSeed = (language: LANGUAGE, mnemonic: string): string => {
    const mn = new Mnemonic(language);

    return mn.toSeed(mnemonic);
};

/**
 * 通过固定hash生成助记词
 */
export const generateByHash = (language: LANGUAGE, hash: string): string => {
    if (hash.length % 32 !== 0) {
        throw new Error('Strength should be greater or equal to 128 and divided by 32');
    }
    const mn = new Mnemonic(language);
    const r = str2arr(hash);

    return mn.toMnemonic(r);
};

/**
 * 助记词获得随机数hash
 * 
 * @param mnemonic 助记词
 */
export const getHashByMnemonic = (language: LANGUAGE, mnemonic: string): string => {
    const words = mnemonic.split(language === 'japanese' ? '\u3000' : ' ');

    return '';
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
