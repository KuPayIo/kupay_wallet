// import { Struct, structMgr } from '../../pi/struct/struct_mgr';
import { popNew } from '../../pi/ui/root';
import { listDirFile } from '../../pi/widget/util';
/**
 * commonjs 动态加载文件
 */

declare var pi_modules;

// /**
//  * 注册了所有可以rpc调用的结构体
//  * @param fileMap file map
//  */
// export const registerRpcStruct = (fileMap) => {
//     if (!(<any>self).__mgr) {
//         (<any>self).__mgr = structMgr;
//     }
//     for (const k in fileMap) {
//         if (!k.endsWith('.s.js')) {
//             continue;
//         }
//         const filePath = k.slice(0, k.length - pi_modules.butil.exports.fileSuffix(k).length - 1);
//         const exp = pi_modules[filePath] && pi_modules[filePath].exports;
//         for (const kk in exp) {
//             if (Struct.isPrototypeOf(exp[kk]) && exp[kk]._$info && exp[kk]._$info.name) {
//                 if (!(<any>self).__mgr.lookup(exp[kk]._$info.name_hash)) {
//                     (<any>self).__mgr.register(exp[kk]._$info.name_hash, exp[kk], exp[kk]._$info.name);
//                 }
//             }
//         }
//     }
// };
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
export const piLoadDir = (sourceList:string[],flags?:any,fm?:any,suffixCfg?:any,isLoadDir?:boolean) => {
    return new Promise((resolve,reject) => {
        const html = relativeGet('pi/util/html');
        html.checkWebpFeature((r) => {
            flags = flags || {};
            flags.webp = flags.webp || r;
            const util = relativeGet('pi/widget/util');
            if (isLoadDir) {
                resolve();
            } else {
                const loading = popNew('app-components1-loading-loading1');
                util.loadDir(sourceList, flags, fm, suffixCfg,  (fileMap) => {                
                    const tab = util.loadCssRes(fileMap);
                    tab.timeout = 90000;
                    tab.release();
                    loading.callback(loading.widget);
                    resolve();
                },  (r) => {
                    reject(r);
                }, () => {
                    // console.log();
                });
            }
            
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
