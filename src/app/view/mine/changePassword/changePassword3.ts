import { Widget } from "../../../../pi/widget/widget";
import { getLocalStorage, getCurrentWallet,getCurrentWalletIndex ,encrypt, setLocalStorage, decrypt } from "../../../utils/tools"
import { pswEqualed } from "../../../utils/account"
import { GaiaWallet } from "../../../core/eth/wallet"
import { popNew } from "../../../../pi/ui/root"

export class ChangePasswordStep3 extends Widget{
    public ok:() => void
    constructor(){
        super();
        this.init();
    }

    public init(){
       
        this.state = {
            style:{
                backgroundColor:"#f8f8f8",
                fontSize: "24px",
                color: "#8E96AB",
                lineHeight:"33px"
            },
            inputValue:""
        }
        
    }
    public backPrePage(){
        this.ok && this.ok();
    }

    public btnClick(){
        if(!pswEqualed(this.props.psw,this.state.inputValue)){
            popNew("app-components-message-message", { type: "error", content: "两次密码输入不一致",center:true});
            return;
        }
        let wallets = getLocalStorage("wallets");
        let wallet = getCurrentWallet(wallets);
        let walletPswOld = decrypt(wallet.walletPsw);

        let gwltOld = GaiaWallet.fromJSON(wallet.gwlt);
        let mnemonic = gwltOld.exportMnemonic(walletPswOld);
        let gwltNew = GaiaWallet.fromMnemonic(mnemonic,"english",this.props.psw);
        gwltNew.nickName = gwltOld.nickName;
        wallet.gwlt = gwltNew.toJSON();
        wallet.walletPsw = encrypt(this.state.inputValue);
        setLocalStorage("wallets",wallets);
        popNew("app-components-message-message", { type: "success", content: "密码修改成功", center: true });
        this.ok && this.ok();
    }

    public inputChange(e){
        this.state.inputValue = e.value;
    }

}