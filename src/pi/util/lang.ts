/**
 * 多语言模块
 */

// ============================== 导出
/**
 * @description 多语言字符串，必须由UI组件使用
 * @example
 */
export class LangStr {
    // TODO
}

/**
 * @description 设置当前的显示语言
 * @example
 */
export const setLang = (str: any) => {
    curLang = str;
    for (const f of langListeners) {
        f(str);
    }
};
/**
 * @description 获得当前的显示语言
 * @example
 */
export const getLang = ():string => {
    return curLang;
};
/**
 * @description 添加语言改变监听器
 * @example
 */
export const addLangListener = (cb: Function) => {
    langListeners.push(cb);
};
// ============================== 本地
// 当前语言 cn en fr
let curLang:string = 'en';

// 语言改变监听器
const langListeners:Function[] = [];
