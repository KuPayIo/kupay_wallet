import { Widget } from "../../../../pi/widget/widget";
import { popNew } from "../../../../pi/ui/root";
import { getLocalStorage, getCurrentWallet } from "../../../utils/tools";
import { GaiaWallet } from '../../../core/eth/wallet'

/**
 * back up wallet
 */
export class BackupWallet extends Widget{
    public ok: () => void;
    constructor(){
        super();
    }
    public create(){
        super.create();
        this.init();
    }
    public init(){
        this.state = {
            mnemonic:""
        }
    }
    public backPrePage(){
        this.ok && this.ok();
    }
    public backupWalletClick(){
        popNew("pi-components-message-messagebox", { type: "prompt", title: "输入密码", content: "" }, (r) => {
            if(this.exportMnemonicSucceed(r)){
                let close = popNew("pi-components-loading-loading",{text:"导出中"});
                setTimeout(()=>{
                    close.callback(close.widget);
                    this.ok && this.ok();
                    popNew("app-view-backupMnemonic-backupMnemonic",{ mnemonic:this.state.mnemonic.split(" ") });
                },500);
            }else{
                popNew("pi-components-message-message", { type: "error", content: "密码错误,请重新输入" })
            }
        }, () => {
            console.log("取消")
        })
    }

    public exportMnemonicSucceed(walletPsw:string){
        let wallets = getLocalStorage("wallets");
        let gwltStr = getCurrentWallet(wallets).gwlt;
        let gwlt = GaiaWallet.fromJSON(gwltStr);
        try{
            this.state.mnemonic = gwlt.exportMnemonic(walletPsw);
            return true;
        }catch(e){
            return false;
        }
    }
}