/**
 * vm 资源加载阶段
 */
import { LoadedStage } from "../public/constant";

const storeLoadedCbs = [];           // store加载完成回调

let vmLoadedStage = LoadedStage.START;   // vm资源准备阶段

/**
 * 监听vm push事件
 * @param cb 回调
 */
export const addStoreLoadedListener = (cb:Function) => {
    if (vmLoadedStage >= LoadedStage.STORELOADED) cb && cb();
    storeLoadedCbs.push(cb);
};

/**
 * 触发vm push事件
 * @param args 参数
 */
export const emitVmLoaded = (stage:LoadedStage) => {
    vmLoadedStage = stage;
    for (const cb of storeLoadedCbs) {
        cb && cb();
    }
    storeLoadedCbs.length = 0;
};