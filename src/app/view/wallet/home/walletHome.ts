/**
 * wallet home
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { fetchTotalAssets, fetchWalletAssetList, hasNoWallet } from '../../../utils/tools';

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
        hasNoWallet();
    }

    // 条目点击
    public itemClick(e:any) {
        hasNoWallet();
        const index = e.index;
        popNew('app-view-wallet-transaction-home',{ currencyName:this.state.assetList[index].currencyName });
    }
}