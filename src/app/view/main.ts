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
import { Api } from '../core/eth/api';
import { GaiaWallet } from '../core/eth/wallet';
import { dataCenter } from '../store/dataCenter';
import { getLocalStorage } from '../utils/tools';
// ============================== 导出

export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export const run = (cb): void => {
    addWidget(document.body, 'pi-ui-root');
    // 数据检查
    checkUpdate();
    // 初始化数据
    dataCenter.init();
    // makepayment();
    // 打开界面
    popNew('app-view-app');
    // popNew('app-view-test-test');
    // popNew('app-view-wallet-walletCreate-walletCreate');	// popNew('app-view-application-home');
    // popNew('app-view-groupwallet-groupwallet');
    // popNew('app-view-financialManagement-home');
    // popNew('app-view-mine-walletManagement-walletManagement');

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
async function  test() {
    // console.log('test');
    const api = new Api();
    const contractAddress = '0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702';
    // 0x040e7783A06e9b994F6e90DF5b2933C03F1b8F21
    // 0x14571A8f98301DB5dC5c7640A9C7f6CA5BEaB338
    const addr = '0x040e7783A06e9b994F6e90DF5b2933C03F1b8F21';
    console.log(contractAddress,addr);
    const res = await api.getTokenTransferEvents(contractAddress,addr);
    console.log('token',res);
}
// ============================== 立即执行

// 第3版更新,默认有创建ETH token的版本
/* const updateV3 = () => {
    const wallets = getLocalStorage('wallets');
    if (!wallets) return;
    const walletList = wallets.walletList;
    walletList.forEach(wallet => {
        
    });
    
}; */
