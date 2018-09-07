/**
 * wallet home
 */
import { Widget } from '../../../../pi/widget/widget';
import { fetchWalletAssetList, hasNoWallet } from '../../../utils/tools';

export class WalletHome extends Widget {
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
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
        console.log(e.index);
    }
}