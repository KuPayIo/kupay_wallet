import { Widget } from "../../../pi/widget/widget";
import { popNew } from "../../../pi/ui/root";
import { getLocalStorage, getCurrentWallet } from "../../utils/tools";


interface Props{
    mnemonic:string
}
/**
 * back up Mnemonic
 */
export class BackupMnemonic extends Widget{
    public ok: () => void;
    constructor(){
        super();
    }
    public create(){
        super.create();
    }
    public setProps(props:Props,oldProps:Props){
        super.setProps(props,oldProps);
    }
    public backPrePage(){
        this.ok && this.ok();
    }
    public nextStepClick(){
        this.ok && this.ok();
        popNew("app-view-backupMnemonicConfirm-backupMnemonicConfirm",{mnemonic:this.props.mnemonic});
    }
}