/**
 * cloud home
 */
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { callGetServerCloudBalance } from '../../../middleLayer/netBridge';
import { callFetchCloudTotalAssets, callFetchCloudWalletAssetList, callGetCurrencyUnitSymbol } from '../../../middleLayer/toolsBridge';
import { getProductList } from '../../../net/pull';
import { CloudCurrencyType, Product } from '../../../publicLib/interface';
import { getModulConfig } from '../../../publicLib/modulConfig';
import { formatBalanceValue } from '../../../publicLib/tools';
import { getStore, register } from '../../../store/memstore';
import { popNew3 } from '../../../utils/tools';
// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface Props {
    isActive:boolean;
}
export class CloudHome extends Widget {
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.props.financialModulIsShow = getModulConfig('FINANCIAL_SERVICES'); // 优选理财模块配置
        this.init();
        if (props.isActive) {
            getProductList();
            callGetServerCloudBalance();
        }
    }
    public init() {
        const color = getStore('setting/changeColor','redUp');
        this.props = {
            ...this.props,
            totalAsset:formatBalanceValue(0),
            assetList:[],
            productList:getStore('activity/financialManagement/products',[]),
            redUp:color === 'redUp',
            currencyUnitSymbol:''
        };
        Promise.all([callFetchCloudTotalAssets(),callFetchCloudWalletAssetList(),
            callGetCurrencyUnitSymbol()]).then(([totalAsset,assetList,currencyUnitSymbol]) => {
                this.props.totalAsset = formatBalanceValue(totalAsset);
                this.props.assetList = assetList;
                this.props.currencyUnitSymbol = currencyUnitSymbol;
                this.paint();
            });
    }

    // 条目点击
    public itemClick(e:any) {
        const index = e.index;
        const v = this.props.assetList[index];
        if (v.currencyName === CloudCurrencyType[CloudCurrencyType.SC] || v.currencyName === CloudCurrencyType[CloudCurrencyType.KT]) {
            popNew3('app-view-wallet-cloudWalletCustomize-home',{ currencyName:v.currencyName,gain:v.gain });
        } else {
            popNew3('app-view-wallet-cloudWallet-home',{ currencyName:v.currencyName,gain:v.gain });
        }
    }
    
    public updateProductList(productList:Product[]) {
        this.props.productList = productList;
        this.paint();
    }
    
    public updateBalance() {
        Promise.all([callFetchCloudTotalAssets(),callFetchCloudWalletAssetList()]).then(([totalAsset,assetList]) => {
            this.props.totalAsset = formatBalanceValue(totalAsset);
            this.props.assetList = assetList;
            this.paint();
        });
    }
    public optimalClick() {
        popNew3('app-view-wallet-financialManagement-home',{ activeNum:0 });
    }
    public fmItemClick(e:any,index:number) {
        const product = this.props.productList[index];
        popNew3('app-view-wallet-financialManagement-productDetail',{ product });
    }

    public currencyUnitChange() {
        Promise.all([callFetchCloudTotalAssets(),callFetchCloudWalletAssetList(),
            callGetCurrencyUnitSymbol()]).then(([totalAsset,assetList,currencyUnitSymbol]) => {
                this.props.totalAsset = formatBalanceValue(totalAsset);
                this.props.assetList = assetList;
                this.props.currencyUnitSymbol = currencyUnitSymbol;
                this.paint();
            });
    }
}

// =======================本地
register('user',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
        w.paint();
    }
});

// 云端余额变化
register('cloud/cloudWallets',() => {
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

// 理财产品变化
register('activity/financialManagement/products', async (productList) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateProductList(productList);
    }
    
});

// 白银价格变化
register('third/silver', () => {
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
