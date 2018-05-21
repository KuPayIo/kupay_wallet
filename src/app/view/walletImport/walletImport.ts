import { Widget } from "../../../pi/widget/widget";
import { popNew } from '../../../pi/ui/root';
import { setLocalStorage, getLocalStorage } from '../../utils/tools'
import { walletNameAvailable,walletPswAvailable,walletPswConfirmAvailable,getWalletPswStrength } from '../../utils/account'

export class WalletImport extends Widget{
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
            walletMnemonic:"",
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
    public walletMnemonicChange(e){
        this.state.walletMnemonic = e.value;
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
    public importWalletClick(){
        if(!this.walletMnemonicAvailable()){
            popNew("pi-components-message-messagebox", { type: "alert", title: "助记词错误", content: "请输入12个助记词" })
            return;
        }
        if(!walletNameAvailable(this.state.walletName)){
            popNew("pi-components-message-messagebox", { type: "alert", title: "钱包名称错误", content: "请输入1-12位钱包名" })
            return;
        }
        if(!walletPswAvailable(this.state.walletPsw)){
            popNew("pi-components-message-message", { type: "error", content: "密码格式不正确,请重新输入" })
            return;
        }
        if(!walletPswConfirmAvailable(this.state.walletPsw,this.state.walletPswConfirm)){
            popNew("pi-components-message-message", { type: "error", content: "密码不一致，请重新输入" })
            return;
        }
        if(!this.state.userProtocolReaded){
            popNew("pi-components-message-message", { type: "notice", content: "请阅读用户协议" })
            return;
        }

        this.importWallet();

        let close = popNew("pi-components-loading-loading",{text:"导入中"});
        setTimeout(()=>{
            close.callback(close.widget);
            this.ok && this.ok();
            popNew("app-view-backUpWallet-backUpWallet");
        },500);
    }
    

    public importWallet(){
        let wallets = getLocalStorage("wallets") || {list:[],curWalletId:""};
        let curWalletId = "";
        for(let i = 0; i < 32;i++ ){
            curWalletId += Math.floor(Math.random() * 10);
        }
        wallets.curWalletId = curWalletId;
        let wallet = {
            walletId:curWalletId,
            walletName:this.state.walletName,
            walletPsw:this.state.walletPsw,
            walletPswTips:this.state.walletPswTips,
            mnemonic:["one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve"]
        }
        wallets.list.push(wallet);
        setLocalStorage("wallets",wallets,true);
    }

    public walletMnemonicAvailable(){
        return this.state.walletMnemonic.split(" ").length === 12;
    }
}