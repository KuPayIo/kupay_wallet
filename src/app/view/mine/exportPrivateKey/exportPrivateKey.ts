import { Widget } from "../../../../pi/widget/widget";
import { getLocalStorage, getCurrentWallet,decrypt } from "../../../utils/tools"
import { GaiaWallet } from "../../../core/eth/wallet"
import { popNew } from "../../../../pi/ui/root"

export class ExportPrivateKey extends Widget{
    public ok:() => void
    constructor(){
        super();
        this.init();
    }
    public init(){
        let wallets = getLocalStorage("wallets");
        let wallet = getCurrentWallet(wallets);
        let walletPsw = decrypt(wallet.walletPsw);
        let currencyRecords = wallet.currencyRecords;
        let htmlStrList = [];
        for(let i = 0;i < currencyRecords.length; i++ ){
            let obj = {
                title:"",
                htmlStr:""
            };
            obj.title = currencyRecords[0].currencyName;
            let addrs = currencyRecords[0].addrs;
            let html = "";
            for(let j = 0;j < addrs.length; j++){
                html = "<p>";
                let gwlt = GaiaWallet.fromJSON(addrs[j].gwlt);
                let privateKey = gwlt.exportPrivateKey(walletPsw);
                html += privateKey;
                html += "</p>";
                obj.htmlStr += html;
            }
            htmlStrList.push(obj);
        }
        this.state = {
            htmlStrList
        }
        
    }
    public backPrePage(){
        this.ok && this.ok();
    }

    public exportClick(e,index){
        let privateKey = this.state.gwlt.exportPrivateKey(this.state.walletPsw);
        popNew("pi-components-message-messagebox", { type: "alert", title: "文字警告", content: privateKey }, () => {
        })
    }

    public collapseChange(e){
        const activeIndexs = e.activeIndexs;
    }
}