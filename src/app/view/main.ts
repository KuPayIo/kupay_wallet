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
import { dataCenter } from '../store/dataCenter';
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
};

const checkUpdate = () => {
    // todo
};

// ============================== 立即执行
