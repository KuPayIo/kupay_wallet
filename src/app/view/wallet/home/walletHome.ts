/**
 * wallet home
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { find } from '../../../store/store';
import { fetchWalletAssetList } from '../../../utils/tools';

export class WalletHome extends Widget {
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            assetList:fetchWalletAssetList()
        };
        console.log('assetList----------',this.state.assetList);
    }
    // 添加资产
    public addAssetClick() {
        const wallet = find('curWallet');
        if (!wallet) {
            popNew('app-components-modalBox-modalBox',{ 
                title:'提示',
                content:'你还没有登录，去登录使用更多功能吧',
                sureText:'去登录',
                cancelText:'暂时不' 
            },() => {
                popNew('app-view-wallet-create-createEnter');
            });

            return;
        }
    }
}