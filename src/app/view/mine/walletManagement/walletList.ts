/**
 * 钱包列表页面展示所有钱包
 */
import { popNew } from '../../../../pi/ui/root';
import { notify } from '../../../../pi/widget/event';
import { Widget } from '../../../../pi/widget/widget';
import { getCurrentWallet, getLocalStorage } from '../../../utils/tools';
import { GlobalWallet } from '../../../core/globalWallet';

export class WalletList extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init() {
        //获取钱包显示头像
        const wallets = getLocalStorage('wallets');
        console.log("-------walletList---------");
        console.log(wallets);
        // const wallet = getCurrentWallet(wallets);
        let fromJSON = GlobalWallet.fromJSON;

        this.state = {
            wallets,
            fromJSON
        }
    }
    public backPrePage() {
        this.ok && this.ok();
    }

    public listItemClicked(walletId) {
        if (this.state.wallets.curWalletId == walletId) {
            alert("a");
        }
    }
}