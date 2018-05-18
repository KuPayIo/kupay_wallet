import { Widget } from "../../../pi/widget/widget";
import { popNew } from '../../../pi/ui/root';
import { setLocalStorage, getLocalStorage } from '../../utils/tools'

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
        const walletPswStrengthList = [{
            text:"弱",
            color:"#FF0000"
        },{
            text:"一般",
            color:"#FF9900"
        },{
            text:"强",
            color:"#33CC00"
        }];

        this.state = {
            walletName:"",
            walletPsw:"",
            walletPswConfirm:"",
            walletPswTips:"",
            userProtocolReaded:false,
            walletPswStrengthList,
            curWalletPswStrength:walletPswStrengthList[0]
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
        this.state.curWalletPswStrength = this.state.walletPswStrengthList[this.getWalletPswStrength()];
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
        if(!this.walletNameAvailable()){
            popNew("pi-components-message-messagebox", { type: "alert", title: "钱包名称错误", content: "请输入1-12位钱包名" })
            return;
        }
        if(!this.walletPswAvailable()){
            popNew("pi-components-message-message", { type: "error", content: "密码格式不正确,请重新输入" })
            return;
        }
        if(!this.walletPswConfirmAvailable()){
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
            popNew("app-view-backUpWallet-backUpWallet");
        },500);
    }
    

    public createWallet(){
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
    public walletNameAvailable(){
        return this.state.walletName.length >=1 && this.state.walletName.length <= 12;
        
    }
    public walletPswAvailable(){
        let reg = /^[\\p{Punct}a-zA-Z0-9]{8,14}$/;
        return reg.test(this.state.walletPsw);
    }

    public walletPswConfirmAvailable(){
        return this.state.walletPsw === this.state.walletPswConfirm;
    }

    public getWalletPswStrength(){
        let len = this.state.walletPsw.length;
        if(len<6){
            return 0;
        }else if(len < 10){
            return 1;
        }else{
            return 2;
        }
    }
}