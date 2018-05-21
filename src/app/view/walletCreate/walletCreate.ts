import { Widget } from "../../../pi/widget/widget";
import { popNew } from '../../../pi/ui/root';
import { setLocalStorage, getLocalStorage, encrypt } from '../../utils/tools'
import { walletNameAvailable,walletPswAvailable,pswEqualed,getWalletPswStrength } from '../../utils/account'
import { GaiaWallet } from '../../core/eth/wallet'
import { notify } from "../../store/store";

export class WalletCreate extends Widget{
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
            walletName:"",
            walletPsw:"",
            walletPswConfirm:"",
            walletPswTips:"",
            userProtocolReaded:false,
            curWalletPswStrength:getWalletPswStrength()
        };
    }
    public backPrePage(){
        this.ok && this.ok();
    }

    public walletNameChange(e){
        this.state.walletName = e.value;
    }
    public walletPswChange(e){
        this.state.walletPsw = e.value;
        this.state.curWalletPswStrength = getWalletPswStrength(this.state.walletPsw);
        this.paint();
    }
    public walletPswConfirmChange(e){
        this.state.walletPswConfirm = e.value;
    }
    public walletPswTipsChange(e){
        this.state.walletPswTips = e.value;
    }
    public checkBoxClick(e){
        this.state.userProtocolReaded = e.newType;
    }
    public agreementClick(){
        popNew("app-view-agreementInterpretation-agreementInterpretation");
    }
    public createWalletClick(){
        if(!walletNameAvailable(this.state.walletName)){
            popNew("pi-components-message-messagebox", { type: "alert", title: "钱包名称错误", content: "请输入1-12位钱包名" })
            return;
        }
        if(!walletPswAvailable(this.state.walletPsw)){
            popNew("pi-components-message-message", { type: "error", content: "密码格式不正确,请重新输入" })
            return;
        }
        if(!pswEqualed(this.state.walletPsw,this.state.walletPswConfirm)){
            popNew("pi-components-message-message", { type: "error", content: "密码不一致，请重新输入" })
            return;
        }
        if(!this.state.userProtocolReaded){
            popNew("pi-components-message-message", { type: "notice", content: "请阅读用户协议" })
            return;
        }

        this.createWallet();

        let close = popNew("pi-components-loading-loading",{text:"创建中"});
        setTimeout(()=>{
            close.callback(close.widget);
            this.ok && this.ok();
            popNew("app-view-backupWallet-backupWallet");
        },500);
    }
    

    public createWallet(){
        let wallets = getLocalStorage("wallets") || {walletList:[],curWalletId:""};
        let gwlt = GaiaWallet.generate("english",128,this.state.walletPsw);
        gwlt.nickName = this.state.walletName;
        let curWalletId = gwlt.address;
        let wallet = {
            walletId:curWalletId,
            walletPsw:encrypt(this.state.walletPsw),
            walletPswTips:this.state.walletPswTips,
            gwlt:gwlt.toJSON()
        }
        wallets.curWalletId = curWalletId;
        wallets.walletList.push(wallet);
        setLocalStorage("wallets",wallets);
        notify("wallets");
    }

    public importWalletClick(){
        popNew("app-view-walletImport-walletImport");
    }
}