import { Widget } from "../../../pi/widget/widget";
import { popNew } from "../../../pi/ui/root";
import { getLocalStorage } from "../../utils/tools";

/**
 * back up wallet
 */
export class BackUpWallet extends Widget{
    public ok: () => void;
    constructor(){
        super();
    }
    public create(){
        super.create();
    }
    public backPrePage(){
        this.ok && this.ok();
    }
    public backUpWalletClick(){
        popNew("pi-components-message-messagebox", { type: "prompt", title: "输入密码", content: "" }, (r) => {
            console.log("确认",r)
            const wallet = getLocalStorage("wallet");
            if(wallet.walletPsw === r){
                let close = popNew("pi-components-loading-loading",{text:"导出中"});
                setTimeout(()=>{
                    close.callback(close.widget);
                    this.ok && this.ok();
                    popNew("app-view-backUpMnemonic-backUpMnemonic");
                },500);
            }else{
                popNew("pi-components-message-message", { type: "error", content: "密码错误,请重新输入" })
            }
        }, () => {
            console.log("取消")
        })
    }
}