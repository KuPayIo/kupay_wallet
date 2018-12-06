/**
 * cloud home
 */
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getModulConfig } from '../../../modulConfig';
import { getProductList, getServerCloudBalance } from '../../../net/pull';
import { Product } from '../../../store/interface';
import { getStore, register } from '../../../store/memstore';
// tslint:disable-next-line:max-line-length
import { fetchCloudTotalAssets, fetchCloudWalletAssetList, formatBalanceValue, getCurrencyUnitSymbol, hasWallet } from '../../../utils/tools';
// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface Props {
    isActive:boolean;
}
export class CloudHome extends Widget {
    public language:any;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.props.financialModulIsShow = getModulConfig('FINANCIAL_SERVICES'); // 优选理财模块配置
        this.init();
        if (props.isActive) {
            getProductList();
            getServerCloudBalance();
        }
    }
    public init() {
        this.language = this.config.value[getLang()];
        const color = getStore('setting/changeColor','redUp');
        this.props = {
            ...this.props,
            totalAsset:formatBalanceValue(fetchCloudTotalAssets()),
            assetList:fetchCloudWalletAssetList(),
            productList:getStore('activity/financialManagement/products',[]),
            redUp:color === 'redUp',
            currencyUnitSymbol:getCurrencyUnitSymbol()
        };
        // console.log('updateTest');
    }

    // 条目点击
    public itemClick(e:any) {
        if (!hasWallet()) return;
        const index = e.index;
        const v = this.props.assetList[index];
        if (v.currencyName === 'GT') {
            popNew('app-view-wallet-cloudWalletGT-home',{ currencyName:v.currencyName,gain:v.gain });
        } else {
            popNew('app-view-wallet-cloudWallet-home',{ currencyName:v.currencyName,gain:v.gain });
        }
    }
    
    public updateProductList(productList:Product[]) {
        this.props.productList = productList;
        this.paint();
    }
    
    public updateBalance() {
        this.props.totalAsset = formatBalanceValue(fetchCloudTotalAssets());
        this.props.assetList = fetchCloudWalletAssetList();
        this.paint();
    }
    public optimalClick() {
        popNew('app-view-wallet-financialManagement-home');
    }
    public fmItemClick(e:any,index:number) {
        const product = this.props.productList[index];
        popNew('app-view-wallet-financialManagement-productDetail',{ product });
    }

    public currencyUnitChange() {
        this.props.totalAsset = formatBalanceValue(fetchCloudTotalAssets());
        this.props.assetList = fetchCloudWalletAssetList();
        this.props.currencyUnitSymbol = getCurrencyUnitSymbol();
        this.paint();
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
