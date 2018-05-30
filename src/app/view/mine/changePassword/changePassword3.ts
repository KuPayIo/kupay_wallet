import { Widget } from "../../../../pi/widget/widget";
import { getLocalStorage, getCurrentWallet,getCurrentWalletIndex ,encrypt, setLocalStorage, decrypt,getAddrsAll } from "../../../utils/tools"
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
        this.changeAllPassword();
        popNew("app-components-message-message", { type: "success", content: "密码修改成功", center: true });
        this.ok && this.ok();
    }

    public inputChange(e){
        this.state.inputValue = e.value;
    }

    /**
     * 修改所有与当前钱包相关联的GaiaWallet的密码
     */
    public changeAllPassword(){
        let wallets = getLocalStorage("wallets");
        let wallet = getCurrentWallet(wallets);
        let walletIndex = getCurrentWalletIndex(wallets);
        let walletPswOld = decrypt(wallet.walletPsw);

        //最外层gwlt修改
        let gwltNew = this.generateNewGaiaWallet(walletPswOld,this.props.psw,wallet.gwlt);
        wallet.gwlt = gwltNew.toJSON();
        wallet.walletPsw = encrypt(this.state.inputValue);


        let needUpdateAddrs = getAddrsAll(wallet);
        //货币列表下所有的地址的gwlt修改
        this.addrsGaiaWalletChange(needUpdateAddrs,walletPswOld,this.props.psw);

        setLocalStorage("wallets",wallets);
    }
    /**
     * 使用新密码生成GaiaWallet对象
     * @param oldPsw 
     * @param newPsw 
     * @param oldGwlt 旧对象string
     * @return 新的GaiaWallet对象
     */
    public generateNewGaiaWallet(oldPsw:string,newPsw:string,oldGwlt:string):GaiaWallet{
        let gwltOld = GaiaWallet.fromJSON(oldGwlt);
        let gwltNew = null;
        try{
            let mnemonic = gwltOld.exportMnemonic(oldPsw);
            gwltNew = GaiaWallet.fromMnemonic(mnemonic,"english",newPsw);
        }catch(e){
            let privateKey = gwltOld.exportPrivateKey(oldPsw);
            gwltNew = GaiaWallet.fromPrivateKey(newPsw,privateKey);
        }
        gwltNew.nickName = gwltOld.nickName;
        return gwltNew;
    }

    /**
     * 更新addrs里面的GaiaWallet对象
     * @param addrs 
     * @param oldPsw 
     * @param newPsw 
     * @return 新的addrs数组
     */
    public addrsGaiaWalletChange(needUpdateAddrs:string[],oldPsw:string,newPsw:string){
        let addrs = getLocalStorage("addrs");
        addrs.forEach((item)=>{
            if(needUpdateAddrs.indexOf(item.addr) >= 0){
                let gwltNew= this.generateNewGaiaWallet(oldPsw,newPsw,item.gwlt);
                item.gwlt = gwltNew.toJSON();
            }
        });
        setLocalStorage("addrs",addrs);
    }


}