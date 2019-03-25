import { getEthApiBaseUrl } from '../core/config';
import { getCurrentEthAddr } from '../utils/tools';

/**
 * 第三方注入配置
 */

export const getPi3Config = () => {
    return {
        thirdBase:'app/api/thirdBase',
        jsApi:'app/api/JSAPI',
        appId:'101',
        imgUrlPre:'http://192.168.31.10/wallet/app/res/image/third/',
        web3EthDefaultAccount:getCurrentEthAddr() ,
        web3ProviderNetWork:getEthApiBaseUrl()
    };
};