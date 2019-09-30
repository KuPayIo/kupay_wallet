import { listDirFile } from '../../pi/widget/util';

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
 * loadDir加载模块
 */
export const piLoadDir = (sourceList:string[],flags?:any,fileMap?:any,suffixCfg?:any) => {
    return new Promise((resolve,reject) => {
        const html = relativeGet('pi/util/html');
        html.checkWebpFeature((r) => {
            flags = flags || {};
            flags.webp = flags.webp || r;
            const util = relativeGet('pi/widget/util');
            util.loadDir(sourceList, flags, fileMap, suffixCfg,  (fileMap) => {
                const tab = util.loadCssRes(fileMap);
                tab.timeout = 90000;
                tab.release();
                resolve();
            },  (r) => {
                reject(r);
            }, () => {
                // console.log();
            });
        });
        
    });
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

/**
 * js脚本下载
 */
export const loadJS = (roots, url, charset, callback, errText, i, afterCallback) => {
    let n;
    if (i >= roots.length) {
        return callback && callback(roots[0] + url, errText);
    }
    const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
    n = document.createElement('script');
    n.charset = charset;
    n.onerror =  () => {
        n.onload = n.onerror = undefined;
        head.removeChild(n);
        loadJS(roots, url, charset, callback, errText, i === undefined ? 0 : i + 1,afterCallback);
    };
    n.onload =  () => {
        n.onload = n.onerror = undefined;
        head.removeChild(n);
        afterCallback && afterCallback();
    };
    n.async = true;
    n.crossorigin = true;
    n.src = roots[i || 0] + url;
    head.appendChild(n);
};

/**
 * 通过load模块加载资源  获取资源原始数据
 */
export const loadDir1 = (dirs:string[],successCb:Function) => {
    let fileList = [];
    const suffixMap = new Map();
    listDirFile(dirs, undefined, fileList, suffixMap, undefined, undefined,undefined);
    fileList = fileList.concat(suffixMap.get('js'));
    const load = pi_modules.load.exports;
    const down = load.create(fileList, successCb, (err) => {
        console.error('load fileList err = ',err);
    }, (res) => {
        // console.log(res);
    });
    load.start(down);
};
