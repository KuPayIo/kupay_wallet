import { Widget } from "../../../../pi/widget/widget";
import { popNew } from '../../../../pi/ui/root';
import { setLocalStorage, getLocalStorage, encrypt } from '../../../utils/tools'
import { walletNameAvailable,walletPswAvailable,pswEqualed,getWalletPswStrength } from '../../../utils/account'
import { GaiaWallet } from "../../../core/eth/wallet";
import { Wallet } from "../../interface"

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
        popNew("app-view-wallet-agreementInterpretation-agreementInterpretation");
    }
    public importWalletClick(){
        if(!walletNameAvailable(this.state.walletName)){
            popNew("app-components-message-messagebox", { type: "alert", title: "钱包名称错误", content: "请输入1-12位钱包名" })
            return;
        }
        if(!walletPswAvailable(this.state.walletPsw)){
            popNew("app-components-message-message", { type: "error", content: "密码格式不正确,请重新输入" })
            return;
        }
        if(!pswEqualed(this.state.walletPsw,this.state.walletPswConfirm)){
            popNew("app-components-message-message", { type: "error", content: "密码不一致，请重新输入" })
            return;
        }
        if(!this.state.userProtocolReaded){
            popNew("app-components-message-message", { type: "notice", content: "请阅读用户协议" })
            return;
        }


        let gwlt = null;
        try{
            gwlt = GaiaWallet.fromMnemonic(this.state.walletMnemonic,"english",this.state.walletPsw);
            gwlt.nickName = this.state.walletName;
        }catch(e){
            popNew("app-components-message-message", { type: "error", content: "无效的助记词" })
            return;
        }
        this.importWallet(gwlt);
        let close = popNew("pi-components-loading-loading",{text:"导入中"});
        setTimeout(()=>{
            close.callback(close.widget);
            this.ok && this.ok();
            popNew("app-view-wallet-backupWallet-backupWallet");
        },500);
    }
    

    public importWallet(gwlt:GaiaWallet): void{
        let wallets = getLocalStorage("wallets") || {walletList:[],curWalletId:""};
        let curWalletId = gwlt.address;
        let wallet:Wallet = {
            walletId:curWalletId,
            walletPsw:encrypt(this.state.walletPsw),
            gwlt:gwlt.toJSON(),
            showCurrencys:["ETH"],
            currencyRecords:[{
                currencyName:"ETH",
                currentAddr:gwlt.address,
                addrs:[{
                    addr:gwlt.address,
                    addrName:"默认地址",
                    gwlt:gwlt.toJSON(),
                    record:[]
                }]
            }]
        }
        if(this.state.walletPswTips.trim().length>0){
            wallet.walletPswTips = encrypt(this.state.walletPswTips.trim());
        }
        

        //判断钱包是否存在
        let len = wallets.walletList.length;
        for(let i = 0; i < len; i ++){
            if(gwlt.address === wallets.walletList[i].walletId){
                wallets.walletList.splice(i,1);//删除已存在钱包
                break;
            }
        }
        wallets.curWalletId = curWalletId;
        wallets.walletList.push(wallet);
        setLocalStorage("wallets",wallets,true);
    }

    /**
     * 判断导入的钱包是否存在
     * @param gwlt imported wallet
     */
    public importedWalletIsExisted(gwlt:GaiaWallet){
        
        let wallets = getLocalStorage("wallets") || {walletList:[],curWalletId:""};
        let len = wallets.walletList.length;
        for(let i = 0; i < len; i ++){
            if(gwlt.address === wallets.walletList[i].walletId){
                return true;
            }
        }
        return false;
    }

  
}