/**
 * 理财声明
 */
import { Widget } from "../../../../pi/widget/widget";
import { Config } from "../../../config";
import { popNew } from "../../../../pi/ui/root";
import { Product } from "../../../store/interface";
interface Props{
    product:Product;
    amount:number;
}
export class ProductStatement extends Widget{
    public ok:()=>void;
    public props:Props;
    public create(){
        super.create();
        this.init();
    }
    public init(){
        this.state = {
            statement:Config.notice,
            readed:false
        }
    }
    public checkBoxClick(e: any) {
        this.state.readed = (e.newType === 'true' ? true : false);
        this.paint();
    }

    public nextClick(){
        if(!this.state.readed) return;
        popNew('app-view-wallet-financialManagement-purchase',{product:this.props.product,amount:this.props.amount});
        this.ok && this.ok();
    }
    public closePage(){
        this.ok && this.ok();
    }
}