/**
 * 处理localStorage和indexDb上的数据
 */
// ===================================================== 导入

// ===================================================== 导出

declare var pi_modules;
const mod = pi_modules.store.exports;

const impl = mod.create('walletStore', 'store');
let initSuccess = false;

/**
 * indexDb初始化
 */
export const initFileStore = () => {
    return new Promise((resolve, reject) => {
        mod.init(impl, () => {
            initSuccess = true;
            resolve();
        }, () => {
            reject();
        });
    });
};

/**
 * 往indexdb写数据
 */
export const writeFile = (key: string,data:any,okCB?,errCB?) => {
    if (!initSuccess) return;
    mod.write(impl,key,data,okCB,errCB);
};

/**
 * 从indexdb读数据
 */
export const getFile = (key: string,okCB,errCB?) => {
    if (!initSuccess) return;
    mod.read(impl,key,okCB,errCB);
};

/**
 * 从indexDb删除数据
 */
export const deleteFile = (key: string,okCB?,errCB?) => {
    if (!initSuccess) return;
    mod.delete(impl,key,okCB,errCB);
};
/**
 * 往localStorage写数据
 */
export const setLocalStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
};

/**
 * 从localStorage读数据
 */
export const getLocalStorage = (key: string, defaultValue = undefined) => {
    return JSON.parse(localStorage.getItem(key)) || defaultValue;
};
