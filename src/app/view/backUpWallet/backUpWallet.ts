import { Widget } from "../../../pi/widget/widget";

/**
 * back up wallet
 */
export class BackUpWallet extends Widget{
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
        }
    }
    public backPrePage(){
        this.ok && this.ok();
    }
}