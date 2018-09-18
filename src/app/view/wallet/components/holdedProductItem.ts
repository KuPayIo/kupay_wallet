import { Widget } from "../../../../pi/widget/widget";
import { PurchaseRecordOne } from "../../../store/interface";
import { popNew } from "../../../../pi/ui/root";

interface Props{
    product:PurchaseRecordOne;
}
export class holdedProductItem extends Widget{
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        console.log(this.props.product);
    }
    public productItemClick(){
        popNew('app-view-wallet-financialManagement-holdedFmDetail',{product:this.props.product});
    }
}