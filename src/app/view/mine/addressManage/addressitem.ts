import {Widget} from "../../../../pi/widget/widget";
import { popNew } from "../../../../pi/ui/root";

export class addressitem extends Widget{
    constructor(){
        super();
    }

    public goDetails(){
        popNew("app-view-mine-addressManage-addritemDetails",{name:this.props.name,address:this.props.address});
    }
}