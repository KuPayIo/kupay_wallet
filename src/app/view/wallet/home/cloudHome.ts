/**
 * cloud home
 */
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { callGetServerCloudBalance } from '../../../middleLayer/wrap';
import { CloudCurrencyType, Product } from '../../../publicLib/interface';
import { getModulConfig } from '../../../publicLib/modulConfig';
import { formatBalanceValue } from '../../../publicLib/tools';
import { popNew3 } from '../../../utils/tools';
// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface Props {
    isActive:boolean;
    currencyUnitSymbol:string;   // 货币符号 '￥' or '$'
    redUp:boolean;               // 涨跌幅颜色
    localTotalAssets:number;    // 本地资产
    localWalletAssetList:any[];   // 本地资产列表
    cloudTotalAssets:number;     // 云端资产
    cloudWalletAssetList:any[];   // 云端资产列表
}
export class CloudHome extends Widget {
    public create() {
        super.create();
        this.props = {
            ...this.props,
            productList:[]
        };
    }
    public setProps(props:Props,oldProps:Props) {
        this.props = {
            ...this.props,
            ...props,
            cloudTotalAssets:formatBalanceValue(props.cloudTotalAssets)
        };
        super.setProps(this.props,oldProps);
        this.props.financialModulIsShow = getModulConfig('FINANCIAL_SERVICES'); // 优选理财模块配置
    }

    // 条目点击
    public itemClick(e:any) {
        const index = e.index;
        const v = this.props.cloudWalletAssetList[index];
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
    
    public optimalClick() {
        popNew3('app-view-wallet-financialManagement-home',{ activeNum:0 });
    }
    public fmItemClick(e:any,index:number) {
        const product = this.props.productList[index];
        popNew3('app-view-wallet-financialManagement-productDetail',{ product });
    }
}

// =======================本地
