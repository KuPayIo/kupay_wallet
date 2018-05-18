import { Widget } from "../../../pi/widget/widget";
import { popNew } from "../../../pi/ui/root";
import { getLocalStorage, setLocalStorage } from "../../utils/tools";

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
        this.state = {
            wallets
        };
    }
    public createWalletClick(){
        this.ok && this.ok();
        popNew("app-view-walletCreate-walletCreate");
    }

    public switchWalletClick(e,index){
        popNew("pi-components-message-messagebox", { type: "prompt", title: "输入密码", content: "" }, (r) => {
            const psw = this.state.wallets.list[index].walletPsw;
            if(r !== psw){
                popNew("pi-components-message-message", { type: "error", content: "密码错误" })
            }else{
                this.switchWallet(this.state.wallets.list[index].walletId);
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