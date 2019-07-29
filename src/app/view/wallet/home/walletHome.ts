/**
 * wallet home
 */
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
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

export class WalletHome extends Widget {
    public create() {
        super.create();
        this.props = {
            ...this.props
        };
    }
    public setProps(props:Props,oldProps:any) {
        this.props = {
            ...this.props,
            ...props,
            localTotalAssets:formatBalanceValue(props.localTotalAssets)
        };
        super.setProps(this.props,oldProps);
    }

    // 添加资产
    public addAssetClick() {
        popNew3('app-view-wallet-localWallet-addAsset');
    }

    // 条目点击
    public itemClick(e:any) {
        const index = e.index;
        const v = this.props.localWalletAssetList[index];
        popNew3('app-view-wallet-transaction-home',{ currencyName:v.currencyName,gain:v.gain });
    }

}
