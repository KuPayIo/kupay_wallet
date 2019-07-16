import { getEthApiBaseUrl } from '../core/config';
import { getCurrentEthAddr } from '../utils/tools';

/**
 * 第三方注入配置
 */
 // 按钮模式
enum ButtonMods { 
    FLOATBUTTON = 1,  // 悬浮框样式1  三个点 可拖动
    WXBUTTON = 2,      // 微信小程序样式
    FLOATBUTTON2 = 3   // 悬浮框样式2  图标 可拖动
}

export const getPi3Config = () => {
    return {
        buttonMods:ButtonMods,   // 所有按钮模式
        buttonMod:ButtonMods.FLOATBUTTON2,   // 当前按钮模式
        thirdBase:'app/api/thirdBase',
        jsApi:'app/api/JSAPI',
        imgUrlPre:'http://192.168.33.13/wallet/app/res/image/third/',
        web3EthDefaultAccount:getCurrentEthAddr() ,
        web3ProviderNetWork:getEthApiBaseUrl()
    };
};