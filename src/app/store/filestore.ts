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
    mod.write(impl,key,JSON.stringify(data),() => {
        // console.log(`写入indexDB成功 key = ${key},value = ${JSON.stringify(data)}`);
        okCB && okCB();
    },(err) => {
        // console.log(`写入indexDB失败 key = ${key},value = ${JSON.stringify(data)}`);
        // console.log('写入indexDB失败原因 = ',JSON.stringify(err));
        errCB && errCB(err);
    });
};

/**
 * 从indexdb读数据
 */
export const getFile = (key: string,okCB,errCB?) => {
    if (!initSuccess) return;
    mod.read(impl,key,(res) => {okCB(JSON.parse(res));},errCB);
};

/**
 * 从indexDb删除数据
 */
export const deleteFile = (key: string,okCB?,errCB?) => {
    if (!initSuccess) return;
    mod.delete(impl,key,okCB,errCB);
};

// localStorageImpl indexdb实现
const localStorageImpl = mod.create('localStorage', 'localStorageStore');
let localStorageSuccess = false;

/**
 * localStorage indexDb初始化
 */
export const initLocalStorageFileStore = () => {
    return new Promise((resolve, reject) => {
        mod.init(localStorageImpl, () => {
            localStorageSuccess = true;
            resolve();
        }, () => {
            reject();
        });
    });
};

/**
 * 往localStorage写数据
 */
export const setLocalStorage = (key: string, data: any) => {
    // localStorage.setItem(key, JSON.stringify(data));
    return new Promise((resolve,reject) => {
        if (!localStorageSuccess) reject('indexdb not init');
        const data1 = JSON.stringify(data);
        mod.write(localStorageImpl,key,data1,() => {
            // console.log('写入数据库成功',key);
            // console.log('写入成功数据',data1);
            resolve();
        },(err) => {
            // console.log('写入数据库失败',key);
            // console.log('写入失败数据',JSON.stringify(data));
            // console.log('写入失败原因',JSON.stringify(err));
            reject();
        });
    });
    
};

/**
 * 从localStorage读数据
 */
export const getLocalStorage = (key: string, defaultValue = undefined):Promise<any> => {
    // return JSON.parse(localStorage.getItem(key)) || defaultValue;
    return new Promise((resolve,reject) => {
        if (!localStorageSuccess) reject('indexdb not init');
        mod.read(localStorageImpl,key,(res) => {
            if (!res) {
                resolve(defaultValue);
                
                return;
            }
            const result = JSON.parse(res);
            // console.log('读取数据成功',key);
            // console.log('读取成功数据',res);
            resolve(result);
        },(err) => {
            // console.log('读取数据失败',key);
            // console.log('读取失败原因',JSON.stringify(err));
            resolve(defaultValue);
        });
    });
    
};

/**
 * 从indexDb删除数据
 */
export const removeLocalStorage = (key: string) => {
    return new Promise((resolve,reject) => {
        if (!localStorageSuccess) reject('indexdb not init');
        mod.delete(localStorageImpl,key,resolve,reject);
    });
   
};