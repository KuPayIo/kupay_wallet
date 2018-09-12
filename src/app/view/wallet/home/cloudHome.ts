/**
 * cloud home
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { hasWallet, fetchCloudWalletAssetList, fetchCloudTotalAssets } from '../../../utils/tools';
import { Forelet } from '../../../../pi/widget/forelet';
import { register } from '../../../store/store';
// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class CloudHome extends Widget {
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            totalAsset:fetchCloudTotalAssets(),
            assetList:fetchCloudWalletAssetList()
        };
    }
    // 添加资产
    public addAssetClick() {
        if(!hasWallet()) return;
        popNew('app-view-wallet-localWallet-addAsset');
    }

    // 条目点击
    public itemClick(e:any) {
        if(!hasWallet()) return;
        const index = e.index;
        const v = this.state.assetList[index];
        popNew('app-view-wallet-cloudWallet-home',{ currencyName:v.currencyName,gain:v.gain });
    }

    
}

// ==================本地

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
