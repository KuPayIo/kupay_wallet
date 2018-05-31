/**
 * change password step three
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { pswEqualed } from '../../../utils/account';
import { decrypt, getCurrentWallet,getLocalStorage } from '../../../utils/tools';

export class ChangePasswordStep1 extends Widget {
    public ok:() => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init() {
        const wallets = getLocalStorage('wallets');
        const wallet = getCurrentWallet(wallets);
        const walletPsw = decrypt(wallet.walletPsw);
        this.state = {
            style:{
                backgroundColor:'#f8f8f8',
                fontSize: '24px',
                color: '#8E96AB',
                lineHeight:'33px'
            },
            walletPsw,
            inputValue:''
        };
        
    }
    public backPrePage() {
        this.ok && this.ok();
    }

    public btnClick() {
        if (!pswEqualed(this.state.walletPsw,this.state.inputValue)) {
            popNew('app-components-message-message', { itype: 'error', content: '密码错误',center:true });

            return;
        }
        popNew('app-view-mine-changePassword-changePassword2');
        this.ok && this.ok();
    }

    public inputChange(e:any) {
        this.state.inputValue = e.value;
    }

    public importWalletClick() {
        this.ok && this.ok();
        popNew('app-view-wallet-walletImport-walletImport');
    }
}