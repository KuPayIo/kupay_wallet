/**
 * switch wallet 
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { GlobalWallet } from '../../../core/globalWallet';
import { openAndGetRandom } from '../../../store/conMgr';
import { find, updateStore } from '../../../store/store';
import { nickNameInterception } from '../../../utils/account';

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
        const walletList = find('walletList').map(v => {
            v.gwlt = GlobalWallet.fromJSON(v.gwlt);

            return v;
        });
        const curWallet = find('curWallet');
        this.state = {
            close: false,
            walletList,
            curWalletId: curWallet && curWallet.walletId,
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
        updateStore('curWallet', this.state.walletList[index]);
        openAndGetRandom();
        popNew('app-components-message-message', { itype: 'success', content: '切换成功', center: true });
        this.ok && this.ok();
    }

    public closePageClick() {
        this.state.close = true;
        this.paint();
        setTimeout(() => {
            this.ok && this.ok();
        }, 300);

    }

} 