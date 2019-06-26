/**
 * vm 资源加载完成
 */

const callbackList = [];

let vmLoaded = false;   // vm资源是否加载完成

/**
 * 触发vm loaded事件
 * @param args 参数
 */
export const emitVmLoaded = (args:any) => {
    vmLoaded = true;
    for (const cb of callbackList) {
        cb && cb();
    }
    callbackList.length = 0;
};

/**
 * 监听vm loaded
 * @param cb 回调
 */
export const addVmLoadedListener = (cb:Function) => {
    if (vmLoaded) cb && cb();
    callbackList.push(cb);
};