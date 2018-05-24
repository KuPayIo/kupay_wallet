import { Widget } from "../../../../pi/widget/widget";
import { popNew } from "../../../../pi/ui/root";

export class BalanceManagementHome extends Widget{
    public ok:()=>void
    constructor(){
        super();
    }
    public goBackClick(){
        this.ok && this.ok();
    }
}