/**
 * 本地加载进度
 */

let sourceLoaded = false;   // 资源是否已经全部加载完成

const sourceLoadedCallbackList = [];   // 资源加载完成回调

// 设置回调
export const setSourceLoadedCallbackList = (cb:Function) => {
    sourceLoadedCallbackList.push(cb);
};

// 获取sourceLoaded
export const getSourceLoaded = () => {
    return sourceLoaded;
};

// 资源加载完成触发
export const emitSourceLoaded = () => {
    sourceLoaded = true;
    for (const v of sourceLoadedCallbackList) {
        v && v();
    }
};