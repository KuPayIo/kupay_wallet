/**
 * webview被重新拉起相关
 */

const cbs = [];

/**
 * 注册监听器
 */
export const addWebviewReloadListener = (cb:Function) => {
    cbs.push(cb);
};

/**
 * webview reload success
 */
export const emitWebviewReload = () => {
    for (const cb of cbs) {
        cb();
    }
    cbs.length = 0;
};