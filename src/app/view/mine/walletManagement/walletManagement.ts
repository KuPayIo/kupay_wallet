import { Widget } from "../../../../pi/widget/widget";
import { getLocalStorage, getCurrentWallet,decrypt } from "../../../utils/tools"
import { pswEqualed } from "../../../utils/account"
import { GaiaWallet } from "../../../core/eth/wallet"
import { popNew } from "../../../../pi/ui/root"

export class WalletManagement extends Widget{
    public ok: () => void;
    constructor(){
        super();
        this.init();
    }
    public init(){
        let wallets = getLocalStorage("wallets");
        let wallet = getCurrentWallet(wallets);
        let gwlt = GaiaWallet.fromJSON(wallet.gwlt);
        let pswTips = "";
        if(wallet.walletPswTips){
            pswTips = decrypt(wallet.walletPswTips);
        }
        let walletPsw = decrypt(wallet.walletPsw)
        this.state = {
            gwlt,
            showPswTips:false,
            pswTips,
        }
    }
    public backPrePage(){
        this.ok && this.ok();
    }

    public pswTipsClick(){
        this.state.showPswTips = !this.state.showPswTips;
        this.paint();
    }

    public exportPrivateKeyClick(){
        popNew("pi-components-message-messagebox", { type: "prompt", title: "输入密码", content: "",inputType:"password" }, (r) => {
            let wallets = getLocalStorage("wallets");
            let wallet = getCurrentWallet(wallets);
            let walletPsw = decrypt(wallet.walletPsw);
            if(pswEqualed(r,walletPsw)){
                let close = popNew("pi-components-loading-loading",{text:"导出私钥中"});
                setTimeout(()=>{
                    close.callback(close.widget);
                    popNew("app-view-mine-exportPrivateKey-exportPrivateKey");
                },500);
            }else{
                popNew("pi-components-message-message", { type: "error", content: "密码错误" })
            }
        })
    }
}