import { Widget } from "../../../../pi/widget/widget";
import { popNew } from "../../../../pi/ui/root";
import { getLocalStorage, getCurrentWallet, decrypt } from "../../../utils/tools";
import { pswEqualed } from "../../../utils/account";
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
        popNew("app-components-message-messagebox", { type: "prompt", title: "输入密码", content: "",inputType:"password" }, (r) => {
            let wallets = getLocalStorage("wallets");
            let wallet = getCurrentWallet(wallets);
            let walletPsw = decrypt(wallet.walletPsw);
            if(pswEqualed(r,walletPsw)){
                let close = popNew("pi-components-loading-loading",{text:"导出中"});
                setTimeout(()=>{
                    close.callback(close.widget);
                    this.ok && this.ok();
                    popNew("app-view-wallet-backupMnemonic-backupMnemonic");
                },500);
            }else{
                popNew("app-components-message-message", { type: "error", content: "密码错误,请重新输入", center: true })
            }
        }, () => {
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