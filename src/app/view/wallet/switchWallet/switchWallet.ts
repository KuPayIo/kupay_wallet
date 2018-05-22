import { Widget } from "../../../../pi/widget/widget";
import { popNew } from "../../../../pi/ui/root";
import { getLocalStorage, setLocalStorage, encrypt, decrypt } from "../../../utils/tools";
import { GaiaWallet } from "../../../core/eth/wallet";
import { pswEqualed } from "../../../utils/account";

export class SwitchWallet extends Widget{
    public ok:()=>void;
    constructor(){
        super();
    }
    public create(){
        super.create();
        this.init();
    }
    public init(){
        let wallets = getLocalStorage("wallets");
        for(let i = 0;i < wallets.walletList.length; i ++){
            wallets.walletList[i].gwlt = GaiaWallet.fromJSON(wallets.walletList[i].gwlt);
        }
        this.state = {
            wallets
        };
    }
    public createWalletClick(){
        this.ok && this.ok();
        popNew("app-view-wallet-walletCreate-walletCreate");
    }

    public importWalletClick(){
        this.ok && this.ok();
        popNew("app-view-wallet-walletImport-walletImport");
    }
    public switchWalletClick(e,index){
        popNew("pi-components-message-messagebox", { type: "prompt", title: "输入密码", content: "" }, (r) => {
            const psw = decrypt(this.state.wallets.walletList[index].walletPsw);
            if(!pswEqualed(psw,r)){
                popNew("pi-components-message-message", { type: "error", content: "密码错误" })
            }else{
                this.switchWallet(this.state.wallets.walletList[index].walletId);
                this.ok && this.ok();
            }
        })
    }

    public switchWallet(curWalletId){
        let wallets = getLocalStorage("wallets");
        wallets.curWalletId = curWalletId;
        setLocalStorage("wallets",wallets,true);
    }

    public closePageClick(){
        this.ok && this.ok();
    }
} 