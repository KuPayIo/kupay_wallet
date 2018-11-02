/**
 * 多语言组件
 */

// ============================== 导入
import { addLangListener,getLang } from '../util/lang';
import { Forelet } from '../widget/forelet';

// ============================== 导出
/**
 * @description 导出组件Widget类
 * @example
 */
export const forelet = new Forelet();

// ============================== 本地

// ============================== 立即执行
addLangListener((langType:string) => {
    forelet.paint(langType);
});

forelet.paint(getLang());