import { LoadedStage } from '../publicLib/interface';

/**
 * vm 资源加载完成
 */
const storeLoadedCbs = [];           // store加载完成回调
const vmLoadedCbs = [];              // 所有资源加载完成回调

let vmLoadedStage = LoadedStage.START;   // vm资源准备阶段

/**
 * 触发vm loaded事件
 * @param args 参数
 */
export const emitVmLoaded = (stage:LoadedStage) => {
    vmLoadedStage = stage;
    const cbs = vmLoadedStage === LoadedStage.STORELOADED ? storeLoadedCbs : vmLoadedCbs;
    for (const cb of cbs) {
        cb && cb();
    }
    cbs.length = 0;
};

/**
 * 监听vm loaded
 * @param cb 回调
 */
export const addVmLoadedListener = (cb:Function) => {
    if (vmLoadedStage === LoadedStage.ALLLOADED) cb && cb();
    vmLoadedCbs.push(cb);
};

/**
 * 监听store loaded
 * @param cb 回调
 */
export const addStoreLoadedListener = (cb:Function) => {
    if (vmLoadedStage === LoadedStage.STORELOADED) cb && cb();
    storeLoadedCbs.push(cb);
};