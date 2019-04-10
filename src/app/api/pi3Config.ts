import { getEthApiBaseUrl } from '../core/config';
import { getCurrentEthAddr } from '../utils/tools';

/**
 * 第三方注入配置
 */

 // 按钮模式
enum ButtonMod { 
    FLOATBUTTON = 1,  // 悬浮框 可拖动
    WXBUTTON = 2      // 微信小程序样式
}
export const getPi3Config = () => {
    return {
        buttonMod:ButtonMod.FLOATBUTTON,
        thirdBase:'app/api/thirdBase',
        jsApi:'app/api/JSAPI',
        imgUrlPre:'http://192.168.31.10/wallet/app/res/image/third/',
        web3EthDefaultAccount:getCurrentEthAddr() ,
        web3ProviderNetWork:getEthApiBaseUrl()
    };
};