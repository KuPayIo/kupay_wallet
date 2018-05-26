import {Widget} from "../../../../pi/widget/widget";
import { popNew } from "../../../../pi/ui/root";

export class addressitem extends Widget{
    constructor(){
        super();
        this.props={        
            name:"BTC 001",
            money:"2.00",
            address:"Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f"
        }
    }

    public goDetails(){
        popNew("app-view-mine-addressManage-addritemDetails",{name:this.props.name,address:this.props.address});
    }
}