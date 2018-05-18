import { Widget } from "../../../pi/widget/widget";
import { popNew } from "../../../pi/ui/root";
import { getLocalStorage } from "../../utils/tools";

/**
 * back up Mnemonic
 */
export class BackUpMnemonic extends Widget{
    public ok: () => void;
    constructor(){
        super();
    }
    public create(){
        super.create();
        this.init();
    }
    public init(){
        let wallet = getLocalStorage("wallet");
        this.state = {
            mnemonic:wallet.mnemonic
        }
    }
    public backPrePage(){
        this.ok && this.ok();
    }
    public nextStepClick(){
        this.ok && this.ok();
        popNew("app-view-backUpMnemonicConfirm-backUpMnemonicConfirm");
    }
}