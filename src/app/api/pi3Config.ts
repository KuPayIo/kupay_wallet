import { sourceIp } from '../public/config';
import { ButtonMods } from '../view/play/home/gameConfig';

/**
 * 第三方注入配置
 */

export const getPi3Config = () => {
    return {
        buttonMods:ButtonMods,   // 所有按钮模式
        jsApi:'app/remote/JSAPI',
        imgUrlPre:`http://${sourceIp}/browser/app/res/image/third/`
    };
};