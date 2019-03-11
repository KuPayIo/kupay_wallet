
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
 * 通过固定hash生成助记词
 */
export const generateByHash = async (str:string) => {
    const mods = await piRequire(['app/core/genmnemonic']);
    const generateByHash = mods[0].generateByHash;

    return generateByHash(str);
};

/**
 * sha3加密
 */
export const sha3 = async (str: string, isHex: boolean) => {
    const mods = await piRequire(['app/core/genmnemonic']);
    const sha3 = mods[0].sha3;

    return sha3(str,isHex);
};

/**
 * 随机值转助记词
 * @param language 语言
 * @param randomValues 随机数
 */
// tslint:disable-next-line:max-line-length
export const toMnemonic = async (language: 'english' | 'chinese_simplified' | 'chinese_traditional' | 'japanese', randomValues: Uint8Array) => {
    const mods = await piRequire(['app/core/genmnemonic']);
    const toMnemonic = mods[0].toMnemonic;

    return toMnemonic(language,randomValues);
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
 * 获取GlobalWallet
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

// =============================app/core/globalWallet================================================