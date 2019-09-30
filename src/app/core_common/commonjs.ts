import { inAndroidApp, inIOSApp } from '../public/config';

/**
 * commonjs 动态加载文件
 */

declare var pi_modules;
export const inApp = inAndroidApp || inIOSApp;

/**
 * 动态下载文件
 * @param sourceList 要加载的文件目录数组
 */
export const piRequire = (sourceList:string[]) => {
    return new Promise((resolve,reject) => {
        pi_modules.commonjs.exports.require(sourceList, {},  (mods, tmpfm) => {
            resolve(mods);
        },(result) => {
            reject(result);
        }, () => {
            // console.log();
        });
    });
};

/**
 * 导入BTCWallet
 */
export const importBTCWallet = async () => {
    let path;
    if (inApp) {
        path = 'app/core/btc/wallet_btc_rust';
    } else {
        path = 'app/core_pc/btc/wallet';
    }

    const mods = await piRequire([path]);

    return mods[0].BTCWallet;
};

/**
 * 导入EthWallet
 */
export const importEthWallet = async () => {
    let path;
    if (inApp) {
        path = 'app/core/eth/wallet_eth_rust';
    } else {
        path = 'app/core_pc/eth/wallet';
    }

    const mods = await piRequire([path]);

    return {
        EthWallet:mods[0].EthWallet,
        web3:mods[0].web3,
        initWeb3:mods[0].initWeb3
    };
};

/**
 * 导入Cipher
 */
export const importCipher = async () => {
    let path;
    if (inApp) {
        path = 'app/core/crypto/cipher_rust';
    } else {
        path = 'app/core_pc/crypto/cipher';
    }

    const mods = await piRequire([path]);

    return mods[0].Cipher;
};

/**
 * 导入KJUR
 */
export const importKJUR = async () => {
    const path = 'app/core_pc/thirdparty/sample-ecdsa';
    const mods = await piRequire([path]);

    return mods[0].KJUR;
};