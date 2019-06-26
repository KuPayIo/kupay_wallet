import { registerStore } from '../middleLayer/wrap';
import { addVmLoadedListener } from './vmLoaded';

/**
 * 注册store监听  在vm加载完成之后执行
 */
export const registerStoreData = (keyName: string, cb: Function) => {
    addVmLoadedListener(() => {
        registerStore(keyName,cb);
    });
};