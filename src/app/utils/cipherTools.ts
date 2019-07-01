/**
 * 加密相关工具
 */
import { Cipher } from '../core/crypto/cipher';

/**
 * 密码加密
 * @param plainText 需要加密的文本
 */
export const encrypt = (plainText: string, salt: string) => {
    const cipher = new Cipher();

    return cipher.encrypt(salt, plainText);
};

/**
 * 密码解密
 * @param cipherText 需要解密的文本
 */
export const decrypt = (cipherText: string, salt: string) => {
    const cipher = new Cipher();

    return cipher.decrypt(salt, cipherText);
};

// hash256;
export const sha256 = (data: string) => {
    const cipher = new Cipher();

    return cipher.sha256(data);
};