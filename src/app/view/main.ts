/**
 * @file 入口文件，用于登录，唤起hall界面
 * @author henk<speoth@163.com>
 */

// tslint:disable-next-line:no-any
// tslint:disable-next-line:no-reserved-keywords
declare const module;

import { popNew } from '../../pi/ui/root';
import { Forelet } from '../../pi/widget/forelet';
import { addWidget } from '../../pi/widget/util';
import { Api as EthApi } from '../core/eth/api';
import { ERC20Tokens } from '../core/eth/tokens'; 
import { GaiaWallet } from '../core/eth/wallet';
import { dataCenter } from '../store/dataCenter';
import { getLocalStorage, setLocalStorage } from '../utils/tools';

// ============================== 导出

export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export const run = (cb): void => {
    addWidget(document.body, 'pi-ui-root');
    // eth代币精度初始化
    initEthTokenDecimals();
    // 数据检查
    checkUpdate();
    // 初始化数据
    dataCenter.init();
    // makepayment();
    // 打开界面
    popNew('app-view-app');
    popNew('app-components-passwordScreen-passwordScreen',{title:"解锁屏幕",extraText:"忘记密码?"});
    if (cb) cb();
    // test();
};

const checkUpdate = () => {
    // todo
};

// 0xf4750c579799634CBBD1F5EFa662abb828b6EfE7
// 0x940703fD0525f75190F84D62Ea578F1A5beF2172
// 0xDEadcA0CF78Caac23a59FfF4353b3D715e26C367
// 0xFeA9610a4C2fCDF63A1755384B42ff760dB68EFC
// tslint:disable-next-line:only-arrow-functions
function  test() {
    document.addEventListener("visibilitychange", function() {
        console.log( document.hidden );
        if(document.hidden){
            console.log("houtai");
        }
    });
}



// ============================== 立即执行



/**
 * eth代币精度初始化
 */
const initEthTokenDecimals = () => {
    const newTokenNames = checkHasNewTokens();
    if (newTokenNames.length === 0) return;

    newTokenNames.forEach(tokenName => {
        const decimalsCode = GaiaWallet.tokenOperations('decimals',tokenName);
        const api = new EthApi();
        api.ethCall(ERC20Tokens[tokenName],decimalsCode).then(r => {
            const ERC20TokenDecimals = getLocalStorage('ERC20TokenDecimals') || {};
            // tslint:disable-next-line:radix
            ERC20TokenDecimals[tokenName] = Math.pow(10,parseInt(r));
            setLocalStorage('ERC20TokenDecimals',ERC20TokenDecimals);
        });
        
    });
    
};

/**
 * 检测是否有新增代币
 */
const checkHasNewTokens = () => {
    const localTokenNames = Object.keys(getLocalStorage('ERC20TokenDecimals') || {});
    const tokenNames = Object.keys(ERC20Tokens);
    const newTokenNames = [];
    tokenNames.forEach(tokenName => {
        if (localTokenNames.indexOf(tokenName) < 0) {
            newTokenNames.push(tokenName);
        }
    });

    return newTokenNames;
};