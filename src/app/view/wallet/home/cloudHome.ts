/**
 * cloud home
 */
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
// tslint:disable-next-line:max-line-length
import { callFetchCloudTotalAssets, callFetchCloudWalletAssetList,callGetProductList, callGetServerCloudBalance,getStoreData } from '../../../middleLayer/wrap';
import { CloudCurrencyType, Product } from '../../../publicLib/interface';
import { getModulConfig } from '../../../publicLib/modulConfig';
import { formatBalanceValue } from '../../../publicLib/tools';
import { getCurrencyUnitSymbol, popNew3 } from '../../../utils/tools';
import { registerStoreData } from '../../../viewLogic/common';
// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface Props {
    isActive:boolean;
}
export class CloudHome extends Widget {
    public create() {
        super.create();
        this.props = {
            ...this.props,
            totalAsset:formatBalanceValue(0),
            assetList:[],
            productList:[],
            redUp:true,
            currencyUnitSymbol:''
        };
    }
    public setProps(props:Props,oldProps:Props) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props,oldProps);
        this.props.financialModulIsShow = getModulConfig('FINANCIAL_SERVICES'); // 优选理财模块配置
        this.init();
        if (props.isActive) {
            callGetProductList();
            callGetServerCloudBalance();
        }
    }
    public init() {
        callFetchCloudTotalAssets().then(totalAsset => {
            this.props.totalAsset = formatBalanceValue(totalAsset);
            this.paint();
        });
        callFetchCloudWalletAssetList().then(assetList => {
            this.props.assetList = assetList;
            this.paint();
        });
        getCurrencyUnitSymbol().then(currencyUnitSymbol => {
            this.props.currencyUnitSymbol = currencyUnitSymbol;
            this.paint();
        });
        getStoreData('setting/changeColor','redUp').then(color => {
            this.props.redUp = color === 'redUp';
            this.paint();
        });
        getStoreData('activity/financialManagement/products',[]).then(productList => {
            this.props.productList = productList;
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
        callFetchCloudTotalAssets().then(totalAsset => {
            this.props.totalAsset = formatBalanceValue(totalAsset);
            this.paint();
        });
        callFetchCloudWalletAssetList().then(assetList => {
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
        callFetchCloudTotalAssets().then(totalAsset => {
            this.props.totalAsset = formatBalanceValue(totalAsset);
            this.paint();
        });
        callFetchCloudWalletAssetList().then(assetList => {
            this.props.assetList = assetList;
            this.paint();
        });
        getCurrencyUnitSymbol().then(currencyUnitSymbol => {
            this.props.currencyUnitSymbol = currencyUnitSymbol;
            this.paint();
        });
    }
}

// =======================本地
registerStoreData('user',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
    }
});

// 云端余额变化
registerStoreData('cloud/cloudWallets',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateBalance();
    }
});

// 货币涨跌幅度变化
registerStoreData('currency2USDTMap',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateBalance();
    }
});

// 理财产品变化
registerStoreData('activity/financialManagement/products', async (productList) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateProductList(productList);
    }
    
});

// 白银价格变化
registerStoreData('third/silver', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateBalance();
    }
    
});
registerStoreData('setting/language', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
    }
});

registerStoreData('setting/changeColor', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
    }
});

// 货币单位变化
registerStoreData('setting/currencyUnit',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.currencyUnitChange();
    }
});
