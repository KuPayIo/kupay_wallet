/**
 * cloud home
 */
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
// tslint:disable-next-line:max-line-length
import { callFetchCloudTotalAssets, callFetchCloudWalletAssetList,callGetProductList, callGetServerCloudBalance,getStoreData, registerStore } from '../../../middleLayer/wrap';
import { CloudCurrencyType, Product } from '../../../publicLib/interface';
import { getModulConfig } from '../../../publicLib/modulConfig';
import { formatBalanceValue } from '../../../publicLib/tools';
import { getCurrencyUnitSymbol, popNew3 } from '../../../utils/tools';
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
            callGetProductList();
            callGetServerCloudBalance();
        }
    }
    public init() {
        this.props = {
            ...this.props,
            totalAsset:formatBalanceValue(0),
            assetList:[],
            productList:[],
            redUp:true,
            currencyUnitSymbol:''
        };
        Promise.all([callFetchCloudTotalAssets(),callFetchCloudWalletAssetList(),
            getCurrencyUnitSymbol(),
            getStoreData('setting/changeColor','redUp'),
            getStoreData('activity/financialManagement/products',[])]).then(([totalAsset,assetList,
                currencyUnitSymbol,color,productList]) => {
                this.props.totalAsset = formatBalanceValue(totalAsset);
                this.props.assetList = assetList;
                this.props.currencyUnitSymbol = currencyUnitSymbol;
                this.props.redUp = color === 'redUp';
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
            getCurrencyUnitSymbol()]).then(([totalAsset,assetList,currencyUnitSymbol]) => {
                this.props.totalAsset = formatBalanceValue(totalAsset);
                this.props.assetList = assetList;
                this.props.currencyUnitSymbol = currencyUnitSymbol;
                this.paint();
            });
    }
}

// =======================本地
registerStore('user',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
        w.paint();
    }
});

// 云端余额变化
registerStore('cloud/cloudWallets',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateBalance();
    }
});

// 货币涨跌幅度变化
registerStore('currency2USDTMap',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateBalance();
    }
});

// 理财产品变化
registerStore('activity/financialManagement/products', async (productList) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateProductList(productList);
    }
    
});

// 白银价格变化
registerStore('third/silver', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateBalance();
    }
    
});
registerStore('setting/language', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
        w.paint();
    }
});

registerStore('setting/changeColor', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
        w.paint();
    }
});

// 货币单位变化
registerStore('setting/currencyUnit',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.currencyUnitChange();
    }
});
