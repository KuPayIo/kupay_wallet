import { Widget } from "../../../../pi/widget/widget";
import { getLocalStorage, getCurrentWallet,decrypt, setLocalStorage } from "../../../utils/tools"
import { pswEqualed,nickNameInterception } from "../../../utils/account"
import { GaiaWallet } from "../../../core/eth/wallet"
import { popNew } from "../../../../pi/ui/root"

export class WalletManagement extends Widget {
    public ok: () => void;
    constructor() {
        super();
        this.init();
    }
    public init() {
        let wallets = getLocalStorage("wallets");
        let wallet = getCurrentWallet(wallets);
        let gwlt = GaiaWallet.fromJSON(wallet.gwlt);
        let walletPsw = decrypt(wallet.walletPsw);
        let mnemonicExisted = true;
        try {
            gwlt.exportMnemonic(walletPsw)
        } catch (e) {
            mnemonicExisted = false;
        }
        let pswTips = "";
        if (wallet.walletPswTips) {
            pswTips = decrypt(wallet.walletPswTips);
        }

        this.state = {
            wallet,
            gwlt,
            showPswTips: false,
            pswTips,
            mnemonicExisted,
            showInputBorder:false,
            nickNameInterception
        }
    }
    public backPrePage() {
        this.ok && this.ok();
    }

    public pswTipsClick() {
        return;
        this.state.showPswTips = !this.state.showPswTips;
        this.paint();
    }

    public exportPrivateKeyClick() {
        return;
        popNew("app-components-message-messagebox", { type: "prompt", title: "输入密码", content: "", inputType: "password" }, (r) => {
            let wallets = getLocalStorage("wallets");
            let wallet = getCurrentWallet(wallets);
            let walletPsw = decrypt(wallet.walletPsw);
            if (pswEqualed(r, walletPsw)) {
                let close = popNew("pi-components-loading-loading", { text: "导出私钥中" });
                setTimeout(() => {
                    close.callback(close.widget);
                    popNew("app-view-mine-exportPrivateKey-exportPrivateKey");
                }, 500);
            } else {
                popNew("app-components-message-message", { type: "error", content: "密码错误", center: true })
            }
        })
    }

    public inputFocus() {
        // let input = document.querySelector("#autoInput");
        // input.value = this.state.gwlt.nickName;
        this.state.showInputBorder = true;
        this.paint();
    }
    public inputBlur(e) {
        let v = e.currentTarget.value.trim();
        if (v.length === 0) {
            popNew("app-components-message-message", { type: "error", content: "钱包名不能为空", center: true })
            let input = document.querySelector("#autoInput");
            input.value = this.state.gwlt.nickName;
            this.state.showInputBorder = false;
            this.paint();
            return;
        }
        if (v !== this.state.gwlt.nickName) {
            this.state.gwlt.nickName = v;
            let wallets = getLocalStorage("wallets");
            let wallet = getCurrentWallet(wallets);
            let addr0 = wallet.currencyRecords[0].addrs[0];
            let gwlt = GaiaWallet.fromJSON(wallet.gwlt);
            gwlt.nickName = v;
            wallet.gwlt = gwlt.toJSON();
            addr0.gwlt = gwlt.toJSON();
            setLocalStorage("wallets", wallets, true);
        }
        this.state.showInputBorder = false;
        this.paint();
    }

    public backupMnemonic(){
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
    /**
     * 显示群钱包
     */
    public showGroupWallet() {
        popNew("app-view-groupwallet-groupwallet");
    }
}