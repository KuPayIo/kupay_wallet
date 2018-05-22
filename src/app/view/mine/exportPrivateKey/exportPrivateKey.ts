import { Widget } from "../../../../pi/widget/widget";
import { getLocalStorage, getCurrentWallet,decrypt } from "../../../utils/tools"
import { GaiaWallet } from "../../../core/eth/wallet"

export class ExportPrivateKey extends Widget{
    public ok:() => void
    constructor(){
        super();
        this.init();
    }
    public init(){
        let wallets = getLocalStorage("wallets");
        let wallet = getCurrentWallet(wallets);
        let gwlt = GaiaWallet.fromJSON(wallet.gwlt);
        let walletPsw = decrypt(wallet.walletPsw)
        this.state = {
            gwlt,
            walletPsw
        }
        console.log(gwlt.exportPrivateKey(walletPsw))
    }
    public backPrePage(){
        this.ok && this.ok();
    }

}