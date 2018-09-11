/**
 * wallet home
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { fetchTotalAssets, fetchWalletAssetList, hasWallet } from '../../../utils/tools';
import { Forelet } from '../../../../pi/widget/forelet';
import { register } from '../../../store/store';
// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class WalletHome extends Widget {
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            totalAsset:fetchTotalAssets(),
            assetList:fetchWalletAssetList()
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
        popNew('app-view-wallet-transaction-home',{ currencyName:v.currencyName,gain:v.gain });
    }

    
}

// ==================本地

// 当前钱包变化
register('curWallet',(curWallet)=>{
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
        w.paint();
    }
});

//地址变化
register('addrs',(addrs)=>{
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
        w.paint();
    }
});
// 汇率变化
register('exchangeRateJson',(exchangeRateJson)=>{
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
        w.paint();
    }
});

