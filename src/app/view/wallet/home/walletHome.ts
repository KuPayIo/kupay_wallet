/**
 * wallet home
 */
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { callFetchLocalTotalAssets, callFetchWalletAssetList,getStoreData } from '../../../middleLayer/wrap';
import { formatBalanceValue } from '../../../publicLib/tools';
import { getCurrencyUnitSymbol, popNew3 } from '../../../utils/tools';
import { registerStoreData } from '../../../viewLogic/common';
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
        this.props = {
            ...this.props,
            totalAsset:formatBalanceValue(0),
            assetList:[],
            redUp:true,
            currencyUnitSymbol:''
        };
        Promise.all([callFetchLocalTotalAssets(),
            callFetchWalletAssetList(),getCurrencyUnitSymbol(),
            getStoreData('setting/changeColor','redUp')]).then(([totalAsset,assetList,currencyUnitSymbol,color]) => {
                this.props.totalAsset = formatBalanceValue(totalAsset);
                this.props.assetList = assetList;
                this.props.currencyUnitSymbol = currencyUnitSymbol;
                this.props.redUp = color === 'redUp';
                this.paint();
            });
    }

    public updateBalance() {
        Promise.all([callFetchLocalTotalAssets(),
            callFetchWalletAssetList()]).then(([totalAsset,assetList]) => {
                this.props.totalAsset = formatBalanceValue(totalAsset);
                this.props.assetList = assetList;
                this.paint();
            });
    }
    // 添加资产
    public addAssetClick() {
        popNew3('app-view-wallet-localWallet-addAsset');
    }

    // 条目点击
    public itemClick(e:any) {
        const index = e.index;
        const v = this.props.assetList[index];
        popNew3('app-view-wallet-transaction-home',{ currencyName:v.currencyName,gain:v.gain });
    }

    public currencyUnitChange() {
        Promise.all([callFetchLocalTotalAssets(),
            callFetchWalletAssetList(),getCurrencyUnitSymbol()]).then(([totalAsset,assetList,currencyUnitSymbol]) => {
                this.props.totalAsset = formatBalanceValue(totalAsset);
                this.props.assetList = assetList;
                this.props.currencyUnitSymbol = currencyUnitSymbol;
                this.paint();
            });
    }
}

// ==================本地
registerStoreData('user',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
        w.paint();
    }
});

// 钱包记录变化
registerStoreData('wallet',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
        w.paint();
    }
});

// 钱包记录变化
registerStoreData('wallet/currencyRecords',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateBalance();
    }
});

// 货币涨跌幅度变化
registerStoreData('third/currency2USDTMap',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateBalance();
    }
});

// 汇率变化
registerStoreData('third/rate',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateBalance();
    }
});
registerStoreData('setting/language', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
        w.paint();
    }
});
registerStoreData('setting/changeColor', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
        w.paint();
    }
});

// 货币单位变化
registerStoreData('setting/currencyUnit',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.currencyUnitChange();
    }
});