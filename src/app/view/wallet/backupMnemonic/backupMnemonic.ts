import { Widget } from "../../../../pi/widget/widget";
import { popNew } from "../../../../pi/ui/root";
import { getLocalStorage, getCurrentWallet, decrypt } from "../../../utils/tools";
import { GaiaWallet } from "../../../core/eth/wallet";


interface Props{
    mnemonic:string
}
/**
 * back up Mnemonic
 */
export class BackupMnemonic extends Widget{
    public ok: () => void;
    constructor(){
        super();
    }
    public create(){
        super.create();
        this.init();
    }
    public init(){
        let wallets = getLocalStorage("wallets");
        let wallet = getCurrentWallet(wallets);
        let gwlt = GaiaWallet.fromJSON(wallet.gwlt);
        let walletPsw = decrypt(wallet.walletPsw);
        let mnemonic = gwlt.exportMnemonic(walletPsw).split(" ");
        this.state = {
            mnemonic
        }
    }
    public backPrePage(){
        this.ok && this.ok();
    }
    public nextStepClick(){
        this.ok && this.ok();
        popNew("app-view-wallet-backupMnemonicConfirm-backupMnemonicConfirm");
    }
}