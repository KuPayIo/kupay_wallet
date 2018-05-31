/**
 * switch wallet 
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { GaiaWallet } from '../../../core/eth/wallet';
import { nickNameInterception,pswEqualed } from '../../../utils/account';
import { decrypt, encrypt, getLocalStorage, randomRgbColor ,setLocalStorage } from '../../../utils/tools';

export class SwitchWallet extends Widget {
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
        for (let i = 0;i < wallets.walletList.length; i ++) {
            wallets.walletList[i].gwlt = GaiaWallet.fromJSON(wallets.walletList[i].gwlt);
        }
        this.state = {
            wallets,
            randomRgbColor,
            nickNameInterception
        };
    }
    public createWalletClick() {
        this.ok && this.ok();
        popNew('app-view-wallet-walletCreate-walletCreate');
    }

    public importWalletClick() {
        this.ok && this.ok();
        popNew('app-view-wallet-walletImport-walletImport');
    }
    public switchWalletClick(e:Event,index:number,isCurWallet:boolean) {
        if (isCurWallet) {
            return;
        }
        popNew('app-components-message-messagebox', { itype: 'prompt', title: '输入密码', content: '',inputType:'password' }, (r) => {
            const psw = decrypt(this.state.wallets.walletList[index].walletPsw);
            if (!pswEqualed(psw,r)) {
                popNew('app-components-message-message', { itype: 'error', content: '密码错误', center: true });
            } else {
                this.switchWallet(this.state.wallets.walletList[index].walletId);
                this.ok && this.ok();
            }
        });
    }

    public switchWallet(curWalletId:string) {
        const wallets = getLocalStorage('wallets');
        wallets.curWalletId = curWalletId;
        setLocalStorage('wallets',wallets,true);
        const wallets1 = getLocalStorage('wallets');
    }

    public closePageClick() {
        this.ok && this.ok();
    }

} 