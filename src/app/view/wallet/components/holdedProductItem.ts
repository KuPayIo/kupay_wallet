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
        const stateShow = props.product.state === 1 ? '收益中' : '已赎回';
        const stateBg = props.product.state === 1 ? '' : 'status-gray';
        this.state = {
            stateShow,
            stateBg
        }
    }
    public productItemClick(){
        popNew('app-view-wallet-financialManagement-holdedFmDetail',{product:this.props.product});
    }
}