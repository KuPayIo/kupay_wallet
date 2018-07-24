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
import { generate, getRandomValuesByMnemonic, sha3, toMnemonic } from '../core/genmnemonic';
import { Mnemonic } from '../core/thirdparty/bip39';
import { exchangeManage } from '../exchange/manage';
import { dataCenter } from '../store/dataCenter';
import { calcHashValuePromise, getLocalStorage, setLocalStorage } from '../utils/tools';

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
    // exchangeManage.init();
    // 打开界面
    popNewPage();
    // 后台切前台
    backToFront();
    /*  popNew('app-view-wallet-transaction-transfer',{
          currencyBalance: 100,
          fromAddr: '0xssss',
          currencyName: 'ETH',
          rate: { CNY: 100 , USD: 15.2625 }
      }); */
    /*  popNew('app-view-wallet-transaction-receipt',{currencyBalance: 100,
         addr: "0x958b0ba923260a91ffd28e8e9a209240648066c2"}); */
    // popNew('app-view-redEnvelope-send-sendRedEnvelope');
    // popNew('app-view-guidePages-setLockScreenScret',{ jump:true });

    // popNew('app-view-wallet-walletCreate-createByImg-createByImg');
    if (cb) cb();
    // test();
};

/**
 * 界面入口
 */
const popNewPage = () => {
    const hasReadedPrivacyAgreement = getLocalStorage('hasReadedPrivacyAgreement');
    if (hasReadedPrivacyAgreement) {
        popNew('app-view-app');
        if (ifNeedUnlockScreen()) {
            popNew('app-view-guidePages-unlockScreen');
        }

    } else {
        popNew('app-view-guidePages-privacyAgreement');
    }
};
const checkUpdate = () => {
    // todo
};

// 0xf4750c579799634CBBD1F5EFa662abb828b6EfE7
// 0x940703fD0525f75190F84D62Ea578F1A5beF2172
// 0xDEadcA0CF78Caac23a59FfF4353b3D715e26C367
// 0xFeA9610a4C2fCDF63A1755384B42ff760dB68EFC
// tslint:disable-next-line:only-arrow-functions
/* function  test() {
    
} */

/**
 * 后台切换到前台
 */
const backToFront = () => {
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            if (ifNeedUnlockScreen()) {
                popNew('app-view-guidePages-unlockScreen');
            }
        }
    });
};

// ============================== 立即执行

/**
 * eth代币精度初始化
 */
const initEthTokenDecimals = () => {
    const newTokenNames = checkHasNewTokens();
    if (newTokenNames.length === 0) return;

    newTokenNames.forEach(tokenName => {
        const decimalsCode = GaiaWallet.tokenOperations('decimals', tokenName);
        const api = new EthApi();
        api.ethCall(ERC20Tokens[tokenName], decimalsCode).then(r => {
            const ERC20TokenDecimals = getLocalStorage('ERC20TokenDecimals') || {};
            // tslint:disable-next-line:radix
            ERC20TokenDecimals[tokenName] = Math.pow(10, parseInt(r));
            setLocalStorage('ERC20TokenDecimals', ERC20TokenDecimals);
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

/**
 * 是否需要解锁屏幕
 */
const ifNeedUnlockScreen = () => {
    const unlockScreen = document.querySelector('#unlock-screen');
    if (unlockScreen) return false;
    const lockScreenPsw = getLocalStorage('lockScreenPsw');
    const openLockScreen = getLocalStorage('openLockScreen') !== false;

    return lockScreenPsw && openLockScreen;
};

const test = async () => {

    const m = generate('english', 128);
    const r = getRandomValuesByMnemonic('english', m);
    console.log(m, r, toMnemonic('english', r));

};
