import { sourceIp } from '../public/config';

/**
 * 第三方注入配置
 */

 // 按钮模式
export enum ButtonMods { 
    FLOATBUTTON = 1,  // 悬浮框样式1  三个点 可拖动
    WXBUTTON = 2,      // 微信小程序样式
    FLOATBUTTON2 = 3   // 悬浮框样式2  图标 可拖动
}
export const getPi3Config = () => {
    return {
        buttonMods:ButtonMods,   // 所有按钮模式
        jsApi:'app/remote/JSAPI',
        imgUrlPre:`http://${sourceIp}/browser/app/res/image/third/`
    };
};