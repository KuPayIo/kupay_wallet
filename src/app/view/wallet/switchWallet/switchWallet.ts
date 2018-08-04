/**
 * switch wallet 
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { GlobalWallet } from '../../../core/globalWallet';
import { openAndGetRandom } from '../../../store/conMgr';
import { nickNameInterception, pswEqualed } from '../../../utils/account';
import { decrypt, getLocalStorage, setLocalStorage } from '../../../utils/tools';

export class SwitchWallet extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init() {
        const wallets = getLocalStorage('wallets');
        for (let i = 0; i < wallets.walletList.length; i++) {
            wallets.walletList[i].gwlt = GlobalWallet.fromJSON(wallets.walletList[i].gwlt);
        }
        this.state = {
            close: false,
            wallets,
            nickNameInterception
        };
    }

    public importWalletClick() {
        this.ok && this.ok();
        popNew('app-view-wallet-walletCreate-createWalletEnter');
    }
    public switchWalletClick(e: Event, index: number, isCurWallet: boolean) {
        if (isCurWallet) {
            return;
        }
        this.switchWallet(this.state.wallets.walletList[index].walletId);
        popNew('app-components-message-message', { itype: 'success', content: '切换成功', center: true });
        this.ok && this.ok();
    }

    public switchWallet(curWalletId: string) {
        const wallets = getLocalStorage('wallets');
        wallets.curWalletId = curWalletId;
        setLocalStorage('wallets', wallets, true);
        
        openAndGetRandom();
    }

    public closePageClick() {
        this.state.close = true;
        this.paint();
        setTimeout(() => {
            this.ok && this.ok();
        }, 300);

    }

} 