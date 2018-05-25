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
        let collapseList = [];
        for(let i = 0;i < currencyRecords.length; i++ ){
            let obj = {
                title:"",
                icon:"",
                textList:[]
            };
            obj.title = currencyRecords[0].currencyName;
            obj.icon = currencyRecords[0].currencyName + ".png";
            let addrs = currencyRecords[0].addrs;
            for(let j = 0;j < addrs.length; j++){
                let gwlt = GaiaWallet.fromJSON(addrs[j].gwlt);
                let privateKey = gwlt.exportPrivateKey(walletPsw);
                obj.textList.push(privateKey);
            }
            collapseList.push(obj);
        }
        this.state = {
            collapseList
        }
        
    }
    public backPrePage(){
        this.ok && this.ok();
    }

    public exportClick(e,index){
        let privateKey = this.state.gwlt.exportPrivateKey(this.state.walletPsw);
        popNew("app-components-message-messagebox", { type: "alert", title: "文字警告", content: privateKey }, () => {
        })
    }

    public collapseChange(e){
        const activeIndexs = e.activeIndexs;
    }
}