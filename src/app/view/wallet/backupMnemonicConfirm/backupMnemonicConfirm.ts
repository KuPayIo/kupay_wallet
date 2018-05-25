import { Widget } from "../../../../pi/widget/widget";
import { popNew } from "../../../../pi/ui/root";
import { getLocalStorage, setLocalStorage, getCurrentWallet, decrypt } from "../../../utils/tools";
import { GaiaWallet } from "../../../core/eth/wallet";


interface Props {
    mnemonic: string
}

/**
 * back up Mnemonic confirm
 */
export class BackupMnemonicConfirm extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }

    public init() {
        let wallets = getLocalStorage("wallets");
        let wallet = getCurrentWallet(wallets);
        let gwlt = GaiaWallet.fromJSON(wallet.gwlt);
        let walletPsw = decrypt(wallet.walletPsw);
        let mnemonic = gwlt.exportMnemonic(walletPsw).split(" ");
        let shuffledMnemonic = this.initMnemonic(mnemonic);
        this.state = {
            mnemonic,
            confirmedMnemonic: [],
            shuffledMnemonic
        }
    }

    //对助记词乱序和标识处理
    public initMnemonic(arr: Array<any>) {
        return this.initActive(this.shuffle(arr));
    }

    //数组乱序
    public shuffle(arr: Array<any>): Array<any> {
        var length = arr.length;
        var shuffled = Array(length);
        for (var index = 0, rand; index < length; index++) {
            rand = ~~(Math.random() * (index + 1));
            if (rand !== index) {
                shuffled[index] = shuffled[rand];
            }
            shuffled[rand] = arr[index];
        }
        return shuffled;
    };

    //初始化每个助记词标识是否被点击
    public initActive(arr: Array<any>): Array<any> {
        let res = [];
        let len = arr.length;
        for (let i = 0; i < len; i++) {
            let obj = {
                word: "",
                isActive: false
            };
            obj.word = arr[i];
            res.push(obj);
        }
        return res;
    }
    public backPrePage() {
        this.ok && this.ok();
    }
    public nextStepClick() {
        if (!this.compareMnemonicEqualed()) {
            popNew("app-components-message-messagebox", { type: "alert", title: "请检查助记词", content: "" });
        } else {
            popNew("app-components-message-messagebox", { type: "confirm", title: "助记词即将移除", content: "Start navigation to Restaurant Mos Eisley?" }, () => {
                this.deleteMnemonic();
                this.ok && this.ok();
            }, () => {
                this.ok && this.ok();
            })
        }
    }

    public deleteMnemonic() {
        let wallets = getLocalStorage("wallets");
        let wallet = getCurrentWallet(wallets);
        let psw = decrypt(wallet.walletPsw);
        let gwlt = GaiaWallet.fromJSON(wallet.gwlt);
        //删除主线助记词
        gwlt.deleteMnemonic(psw);
        wallet.gwlt = gwlt.toJSON();
        //删除第一个地址下的助记词
        let addr0 = wallet.currencyRecords[0].addrs[0];
        addr0.gwlt = gwlt.toJSON();
        setLocalStorage("wallets", wallets);
    }

    public shuffledMnemonicItemClick(e, v) {
        let mnemonic = this.state.shuffledMnemonic[v];
        if (mnemonic.isActive) return;
        mnemonic.isActive = true;
        this.state.confirmedMnemonic.push(mnemonic);
        this.paint();
    }

    public confirmedMnemonicItemClick(e, v) {
        let arr = this.state.confirmedMnemonic.splice(v, 1);
        arr[0].isActive = false;
        this.paint();
    }

    public compareMnemonicEqualed(): boolean {
        let isEqualed = true;
        let len = this.state.mnemonic.length;
        if (this.state.confirmedMnemonic.length !== len) return false;
        for (let i = 0; i < len; i++) {
            if (this.state.confirmedMnemonic[i].word !== this.state.mnemonic[i]) {
                isEqualed = false;
                break;
            }
        }
        return isEqualed;
    }
}