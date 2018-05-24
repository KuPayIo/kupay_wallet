import { Widget } from "../../../../pi/widget/widget";

export class BillDetails extends Widget{
    public ok:()=>void
    constructor(){
        super();
    }
    public create(){
        super.create();
        this.init();
    }
    public goBackClick(){
        this.ok && this.ok();
    }
    public init(){
        this.state = {
            billDetailsList:[{
                
            }]
        }
    }
}