
/**
 * commonjs 动态加载文件
 */

declare var pi_modules;

/**
 * 获取模块导出
 */
export const relativeGet = (path:string) => {
    const mod = pi_modules.commonjs.exports.relativeGet(path);

    return mod ? mod.exports : {};
};

/**
 * loadDir加载模块
 */
export const piLoadDir = (sourceList:string[]) => {
    return new Promise((resolve,reject) => {
        const util = relativeGet('pi/widget/util');
        util.loadDir(sourceList, {}, undefined, undefined,  (fileMap) => {
            const tab = util.loadCssRes(fileMap);
            tab.timeout = 90000;
            tab.release();
            resolve();
        },  (r) => {
            reject(r);
        }, () => {
            // console.log();
        });
    });
};

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

// =============================app/core/genmnemonic================================================

/**
 * 获取genmnemonic模块
 */
export const getGenmnemonicMod = async () => {
    const mods = await piRequire(['app/core/genmnemonic']);

    return mods[0];
};

// =============================app/core/genmnemonic================================================

// =============================app/core/globalWallet================================================
/**
 * 获取GlobalWallet
 */
export const getGlobalWalletClass = async () => {
    const mods = await piRequire(['app/core/globalWallet']);

    return mods[0].GlobalWallet;
};

// =============================app/core/globalWallet================================================

// =============================app/logic/dataCenter================================================
/**
 * 获取dataCenter
 */
export const getDataCenter = async () => {
    const mods = await piRequire(['app/logic/dataCenter']);

    return mods[0].dataCenter;
};

// =============================app/core/globalWallet================================================

// =============================app/net/login================================================
/**
 * 获取login模块
 */
export const getLoginMod = async () => {
    const mods = await piRequire(['app/net/login']);

    return mods[0];
};

// =============================app/net/login================================================

// =============================app/net/reconnect================================================
/**
 * 获取reconnect模块
 */
export const getReconnectMod = async () => {
    const mods = await piRequire(['app/net/reconnect']);

    return mods[0];
};

// =============================app/net/reconnect================================================

// =============================app/net/pull================================================
/**
 * 获取pull模块
 */
export const getPullMod = async () => {
    const mods = await piRequire(['app/net/pull']);

    return mods[0];
};

// =============================app/net/pull================================================

// =============================app/utils/walletTools================================================
/**
 * 获取walletTools模块
 */
export const getWalletTools = async () => {
    const mods = await piRequire(['app/utils/walletTools']);

    return mods[0];
};

// =============================app/utils/walletTools================================================

// =============================app/core/btc/wallet================================================
/**
 * 获取BTCWallet
 */
export const getBTCWallet = async () => {
    const mods = await piRequire(['app/core/btc/wallet']);

    return mods[0].BTCWallet;
};

// =============================app/core/btc/wallet================================================

// =============================app/utils/cipherTools================================================
/**
 * 获取CipherTools
 */
export const getCipherTools = async () => {
    const mods = await piRequire(['app/utils/cipherTools']);

    return mods[0];
};

// =============================app/utils/cipherTools================================================