import { getAllAccount, getStore, register } from '../store/memstore';

/**
 * memstroe.ts 对应的 bridge
 */

/**
 * 注册监听函数
 */
export const registerStore = (key:string,callback:Function) => {
    register(key,callback);
};

/**
 * 获取store数据
 */
export const getStoreData = (key:string, defaultValue = undefined):Promise<any> => {
    return new Promise((resolve) => {
        resolve(getStore(key,defaultValue));
    });
};

/**
 * 获取所有的账户列表
 */
export const callGetAllAccount = ():Promise<any> => {
    return new Promise((resolve) => {
        resolve(getAllAccount());
    });
};