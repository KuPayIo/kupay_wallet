import { Widget } from "../../../pi/widget/widget";
import { popNew } from "../../../pi/ui/root";
import { getLocalStorage, setLocalStorage } from "../../utils/tools";

/**
 * back up Mnemonic confirm
 */
export class BackUpMnemonicConfirm extends Widget{
    public ok: () => void;
    constructor(){
        super();
    }
    public create(){
        super.create();
        this.init();
    }
    public init(){
        const wallet = getLocalStorage("wallet");
        let shuffledMnemonic = this.initMnemonic(wallet.mnemonic);
        this.state = {
            mnemonic:wallet.mnemonic,
            confirmedMnemonic:[],
            shuffledMnemonic
        }
    }

    //对助记词乱序和标识处理
    public initMnemonic(arr:Array<any>){
        return this.initActive(this.shuffle(arr));
    }

    //数组乱序
    public shuffle(arr:Array<any>):Array<any>{
        var length = arr.length;
        var shuffled = Array(length);
        for (var index = 0, rand; index < length; index++) {
            rand = ~~(Math.random() * (index + 1));
            if (rand !== index){
                shuffled[index] = shuffled[rand];
            }
            shuffled[rand] = arr[index];
        }
        return shuffled;
    };

    //初始化每个助记词标识是否被点击
    public initActive(arr:Array<any>):Array<any>{
        let res = [];
        let len = arr.length;
        for(let i = 0;i < len; i++){
            let obj = {
                word:"",
                isActive:false
            };
            obj.word = arr[i];
            res.push(obj);
        }
        return res;
    }
    public backPrePage(){
        this.ok && this.ok();
    }
    public nextStepClick(){
        if(!this.compareMnemonicEqualed()){
            popNew("pi-components-message-messagebox", { type: "alert", title: "请检查助记词", content: "" });
        }else{
            popNew("pi-components-message-messagebox", { type: "confirm", title: "助记词即将移除", content: "Start navigation to Restaurant Mos Eisley?" }, () => {
                let wallet = getLocalStorage("wallet");
                delete wallet.mnemonic;
                setLocalStorage("wallet",wallet);
                this.ok && this.ok();
            }, () => {
                this.ok && this.ok();
            })
        }
    }
    public shuffledMnemonicItemClick(e,v){
        let mnemonic = this.state.shuffledMnemonic[v];
        if(mnemonic.isActive) return;
        mnemonic.isActive = true;
        this.state.confirmedMnemonic.push(mnemonic);
        this.paint();
    }

    public confirmedMnemonicItemClick(e,v){
        let arr = this.state.confirmedMnemonic.splice(v,1);
        arr[0].isActive = false;
        this.paint();
    }

    public compareMnemonicEqualed():boolean{
        let isEqualed = true;
        let len = this.state.mnemonic.length;
        if(this.state.confirmedMnemonic.length !== len) return false;
        for(let i = 0; i< len; i ++){
            if(this.state.confirmedMnemonic[i].word !== this.state.mnemonic[i]){
                isEqualed = false;
                break;
            }
        }
        return isEqualed;
    }
}