/**
 * cloud home
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { hasWallet, fetchCloudWalletAssetList, fetchCloudTotalAssets, formatBalanceValue } from '../../../utils/tools';
import { Forelet } from '../../../../pi/widget/forelet';
import { register } from '../../../store/store';
import { getProductList } from '../../../net/pull';
import { Product } from '../../../store/interface';
// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface Props{
    isActive:boolean;
}
export class CloudHome extends Widget {
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init() {
        this.state = {
            totalAsset:formatBalanceValue(fetchCloudTotalAssets()),
            assetList:fetchCloudWalletAssetList(),
            productList:[]
        };
        if (this.props.isActive) {
            getProductList();
        }
    }

    // 条目点击
    public itemClick(e:any) {
        if(!hasWallet()) return;
        const index = e.index;
        const v = this.state.assetList[index];
        popNew('app-view-wallet-cloudWallet-home',{ currencyName:v.currencyName,gain:v.gain });
    }
    
    public updateProductList(productList:Product[]) {
        this.state.productList = productList;
        this.paint();
    }
    
    public optimalClick(){
        popNew('app-view-wallet-financialManagement-home');
    }
    public fmItemClick(e:any,index:number){
        const product = this.state.productList[index];
        popNew('app-view-wallet-financialManagement-productDetail',{product});
    }
}

// =======================本地

// 汇率变化
register('exchangeRateJson',(exchangeRateJson)=>{
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
        w.paint();
    }
});

// 云端余额变化
register('cloudBalance',(cloudBalance)=>{
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
        w.paint();
    }
});

// 货币涨跌幅度变化
register('coinGain',(coinGain)=>{
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
        w.paint();
    }
});

//理财产品变化
register('productList', async (productList) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateProductList(productList);
    }
    
});