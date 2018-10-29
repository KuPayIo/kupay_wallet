/**
 * wallet home
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getStore, register } from '../../../store/memstore';
// tslint:disable-next-line:max-line-length
import { fetchLocalTotalAssets, fetchWalletAssetList, formatBalanceValue, getCurrencyUnitSymbol, getLanguage, hasWallet } from '../../../utils/tools';
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
        const color = getStore('setting/changeColor','redUp');
        this.state = {
            totalAsset:formatBalanceValue(fetchLocalTotalAssets()),
            assetList:fetchWalletAssetList(),
            cfgData:getLanguage(this),
            redUp:color === 'redUp',
            currencyUnitSymbol:getCurrencyUnitSymbol()
        };
    }

    public updateBalance() {
        this.state.totalAsset = formatBalanceValue(fetchLocalTotalAssets());
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

    public refresh() {
        // const neededRefreshCount = dataCenter.refreshAllTx();
    }

    public currencyUnitChange() {
        this.state.totalAsset = formatBalanceValue(fetchLocalTotalAssets());
        this.state.assetList = fetchWalletAssetList();
        this.state.currencyUnitSymbol = getCurrencyUnitSymbol();
        this.paint();
    }
}

// ==================本地

// 钱包记录变化
register('wallet',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
        w.paint();
    }
});

// 钱包记录变化
register('wallet/currencyRecords',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateBalance();
    }
});

// 货币涨跌幅度变化
register('third/currency2USDTMap',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateBalance();
    }
});

// 汇率变化
register('third/rate',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateBalance();
    }
});

register('setting', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
        w.paint();
    }
});
