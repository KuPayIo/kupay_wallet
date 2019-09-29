import { ArgonHash } from '../../pi/browser/argonHash';
import { importCipher, importKJUR, inApp } from '../core_common/commonjs';
import { getStore, setStore } from '../store/memstore';

/**
 * 密码加密
 * @param plainText 需要加密的文本
 */
export const encrypt = async (plainText: string, salt: string) => {
    const Cipher = await importCipher();
    if (inApp) {
        return Cipher.encrypt(salt, plainText);
    } else {
        const cipher = new Cipher();

        return cipher.encrypt(salt, plainText);
    }
};

/**
 * 密码解密
 * @param cipherText 需要解密的文本
 */
export const decrypt = async (cipherText: string, salt: string) => {
    const Cipher = await importCipher();
    if (inApp) {
        return  Cipher.decrypt(salt, cipherText);
    } else {
        const cipher = new Cipher();

        return cipher.decrypt(salt, cipherText);
    }
};

// hash256;
export const sha256 = async (data: string) => {
    const Cipher = await importCipher();
    if (inApp) {
        return  Cipher.sha256(data);
    } else {
        const cipher = new Cipher();

        return cipher.sha256(data);
    }
};

/**
 * 签名
 */
export const sign = async (msg, privateKey) => {
    if (inApp) {
        const Cipher = await importCipher();

        return  Cipher.sign(msg, privateKey);
    } else {
        const KJUR = await importKJUR();
        const sig = new KJUR.crypto.Signature({ alg: KJUR.jws.JWS.jwsalg2sigalg.ES256 });
        sig.init({ d: privateKey, curve: 'secp256k1' });
        sig.updateString(msg);

        return sig.sign();
    }

};

/**
 * 获取memery hash
 */
export const calcHashValue = (pwd, salt?) => {
    const argonHash = new ArgonHash(); 
    argonHash.init();

    return argonHash.calcHashValuePromise({ pwd, salt });
};

/**
 * 验证当前账户身份
 */
export const VerifyIdentidy = async (passwd:string) => {
    const wallet = getStore('wallet');
    try {
        const hash = await calcHashValue(passwd, getStore('user/salt'));
        await decrypt(wallet.vault,hash);
        
        return hash;
    } catch (error) {
        console.log(error);

        return '';
    }
};

/**
 * 验证某个账户身份
 */
export const VerifyIdentidy1 = async (passwd:string,vault:string,salt:string) => {
    const hash = await calcHashValue(passwd, salt);

    try {
        await decrypt(vault,hash);

        return hash;
    } catch (error) {
        console.log(error);

        return '';
    }
};

/**
 * 修改密码
 */
export const passwordChange = async (secretHash: string, newPsw: string) => {
    const salt = getStore('user/salt');
    const newHash = await calcHashValue(newPsw, salt);
    const wallet = getStore('wallet');
    const oldVault = await decrypt(wallet.vault, secretHash);
    wallet.vault = await encrypt(oldVault, newHash);
    wallet.setPsw = true;
    setStore('wallet',wallet);
};

// 锁屏密码验证
export const lockScreenVerify = async (psw:string) => {
    const hash256 = await sha256(psw + getStore('user/salt'));
    const localHash256 = getStore('setting/lockScreen').psw;

    return hash256 === localHash256;
};

// 锁屏密码hash算法
export const lockScreenHash = (psw:string) => {
    return sha256(psw + getStore('user/salt'));
};

export const rpcTimeingTest = () => {
    // WebViewManager.reloadDefault();
    
    return 12345; 
};
