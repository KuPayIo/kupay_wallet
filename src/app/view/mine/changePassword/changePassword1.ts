import { Widget } from "../../../../pi/widget/widget";
import { getLocalStorage, getCurrentWallet,decrypt } from "../../../utils/tools"
import { pswEqualed } from "../../../utils/account"
import { GaiaWallet } from "../../../core/eth/wallet"
import { popNew } from "../../../../pi/ui/root"

export class ChangePasswordStep1 extends Widget{
    public ok:() => void
    constructor(){
        super();
        this.init();
    }
    public init(){
        let wallets = getLocalStorage("wallets");
        let wallet = getCurrentWallet(wallets);
        let walletPsw = decrypt(wallet.walletPsw);
        this.state = {
            style:{
                backgroundColor:"#f8f8f8",
                fontSize: "24px",
                color: "#8E96AB",
                lineHeight:"33px"
            },
            walletPsw,
            inputValue:""
        }
        
    }
    public backPrePage(){
        this.ok && this.ok();
    }

    public btnClick(){
        if(!pswEqualed(this.state.walletPsw,this.state.inputValue)){
            popNew("app-components-message-message", { type: "error", content: "密码错误",center:true});
            return;
        }
        popNew("app-view-mine-changePassword-changePassword2");
        this.ok && this.ok();
    }

    public inputChange(e){
        this.state.inputValue = e.value;
    }

    public importWalletClick(){
        this.ok && this.ok();
        popNew("app-view-wallet-walletImport-walletImport");
    }
}