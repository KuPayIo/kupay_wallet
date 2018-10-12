/**
 * wallet home
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { find, register } from '../../../store/store';
import { fetchTotalAssets, fetchWalletAssetList, formatBalanceValue, getLanguage, hasWallet } from '../../../utils/tools';
// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class WalletHome extends Widget {
    public create() {
        super.create();
        this.init();
    }
    public init() {
        const color = find('changeColor');
        this.state = {
            totalAsset:formatBalanceValue(fetchTotalAssets()),
            assetList:fetchWalletAssetList(),
            cfgData:getLanguage(this),
            redUp:color ? color.selected === 0 :true
        };
        this.paint();
    }

    public updateBalance() {
        this.state.totalAsset = formatBalanceValue(fetchTotalAssets());
        this.state.assetList = fetchWalletAssetList();
        this.paint();
    }
    // 添加资产
    public addAssetClick() {
        if (!hasWallet()) return;
        popNew('app-view-wallet-localWallet-addAsset');
    }

    // 条目点击
    public itemClick(e:any) {
        if (!hasWallet()) return;
        const index = e.index;
        const v = this.state.assetList[index];
        popNew('app-view-wallet-transaction-home',{ currencyName:v.currencyName,gain:v.gain });
    }

}

// ==================本地

// 当前钱包变化
register('curWallet',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateBalance();
    }
});

// 地址变化
register('addrs',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateBalance();
    }
});
// 汇率变化
register('exchangeRateJson',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateBalance();
    }
});

// 货币涨跌幅度变化
register('currency2USDTMap',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateBalance();
    }
});
register('languageSet', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
    }
});
register('changeColor', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
    }
});