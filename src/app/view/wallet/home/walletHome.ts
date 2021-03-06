/**
 * wallet home
 */
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getStore, register } from '../../../store/memstore';
// tslint:disable-next-line:max-line-length
import { fetchLocalTotalAssets, fetchWalletAssetList, formatBalanceValue, getCurrencyUnitSymbol, hasWallet, popNew3 } from '../../../utils/tools';
// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class WalletHome extends Widget {
    public setProps(props:any,oldProps:any) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init() {
        const color = getStore('setting/changeColor','redUp');
        this.props = {
            ...this.props,
            totalAsset:formatBalanceValue(fetchLocalTotalAssets()),
            assetList:fetchWalletAssetList(),
            redUp:color === 'redUp',
            currencyUnitSymbol:getCurrencyUnitSymbol()
        };
        // console.log('updateTest');
    }

    public updateBalance() {
        this.props.totalAsset = formatBalanceValue(fetchLocalTotalAssets());
        this.props.assetList = fetchWalletAssetList();
        this.paint();
    }
    // 添加资产
    public addAssetClick() {
        if (!hasWallet()) return;
        popNew3('app-view-wallet-localWallet-addAsset');
    }

    // 条目点击
    public itemClick(e:any) {
        if (!hasWallet()) return;
        const index = e.index;
        const v = this.props.assetList[index];
        popNew3('app-view-wallet-transaction-home',{ currencyName:v.currencyName,gain:v.gain });
    }

    public currencyUnitChange() {
        this.props.totalAsset = formatBalanceValue(fetchLocalTotalAssets());
        this.props.assetList = fetchWalletAssetList();
        this.props.currencyUnitSymbol = getCurrencyUnitSymbol();
        this.paint();
    }
}

// ==================本地
register('user',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
        w.paint();
    }
});

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
register('setting/language', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
        w.paint();
    }
});
register('setting/changeColor', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
        w.paint();
    }
});

// 货币单位变化
register('setting/currencyUnit',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.currencyUnitChange();
    }
});