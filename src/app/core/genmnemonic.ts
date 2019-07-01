/**
 * Generate the same mnemonics
 */

import { LANGUAGE } from './btc/wallet';
import { Mnemonic } from './thirdparty/bip39';
import { KJUR } from './thirdparty/sample-ecdsa';
import { Web3 } from './thirdparty/web3.min';
import { WORDLISTS } from './thirdparty/wordlist';

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
 * 通过助记词，获得随机数
 */
export const getRandomValuesByMnemonic = (language: LANGUAGE, mnemonic: string): Uint8Array => {
    mnemonic = splitWords(mnemonic);
    if (mnemonic.length === 0 || mnemonic.length % 3 > 0) {
        throw new Error('mnemonic invalid');
    }
    const idx = [];
    const wordlist = WORDLISTS[language];

    for (let i = 0; i < mnemonic.length; i++) {
        const word = mnemonic[i];
        const wordIndex = wordlist.indexOf(word);
        if (wordIndex === -1) {
            throw new Error('mnemonic invalid');
        }
        const binaryIndex = zfill(wordIndex.toString(2), 11);
        idx.push(binaryIndex);
    }
    const b = idx.join('');
    const d = b.substring(0, b.length / 33 * 32);
    const nd = binaryStringToWordArray(d);

    return new Uint8Array(wordArrayToByteArray(nd));
};

/**
 * 签名
 */
export const sign = (random, privateKey) => {
    console.log(KJUR, KJUR.jws.JWS.jwsalg2sigalg);
    const sig = new KJUR.crypto.Signature({ alg: KJUR.jws.JWS.jwsalg2sigalg.ES256 });
    sig.init({ d: privateKey, curve: 'secp256k1' });
    sig.updateString(random);

    return sig.sign();
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

const splitWords = (mnemonic) => {
    return mnemonic.split(/\s/g).filter((x) => x.length);
};

const zfill = (source, length) => {
    source = source.toString();
    while (source.length < length) {
        source = `0${source}`;
    }

    return source;
};

const binaryStringToWordArray = (binary) => {
    const aLen = binary.length / 32;
    const a = [];
    for (let i = 0; i < aLen; i++) {
        const valueStr = binary.substring(0, 32);
        const value = parseInt(valueStr, 2);
        a.push(value);
        binary = binary.slice(32);
    }

    return a;
};

const wordArrayToByteArray = (data) => {
    const a = [];
    for (let i = 0; i < data.length; i++) {
        a.push(data[i] >> 8 * 3);
        a.push((data[i] >> 8 * 2) & 255);
        a.push((data[i] >> 8 * 1) & 255);
        a.push((data[i]) & 255);
    }

    return a;
};

/**
 * yuqiang
 * 判断助记词是否合法
 * 
 */
export const isValidMnemonic = (language: LANGUAGE, mnemonic: string) => {
    mnemonic = splitWords(mnemonic);
    if (mnemonic.length === 0 || mnemonic.length % 3 > 0) {
        return false;
    }
    const wordlist = WORDLISTS[language];

    for (let i = 0; i < mnemonic.length; i++) {
        const word = mnemonic[i];
        const wordIndex = wordlist.indexOf(word);
        if (wordIndex === -1) {
            return false;
        }
    }

    return true;
};