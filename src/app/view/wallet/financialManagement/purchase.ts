/**
 * 确认购买
 */
// ===============================================导入
import { Widget } from '../../../../pi/widget/widget';
import { Product } from '../../../store/interface';
import { formatBalance, popPswBox } from '../../../utils/tools';
import { purchaseProduct } from '../../../utils/walletTools';
// ==================================================导出
interface Props{
    product:Product;
    amount:number;
}
export class ProductDetail extends Widget {
    public props:Props;
    public ok: () => void;
    constructor() {
        super();
    }
    public setProps(props: Props, oldProps: Props) {
        super.setProps(props,oldProps);
        console.log(props);
        this.init();
    }
    public init() {
        const spend = formatBalance(this.props.product.unitPrice * this.props.amount)
        this.state = {
            spend
        }; 
    }
    public close() {
        this.ok && this.ok();
    }
    public async purchaseClicked() {
        const psw = await popPswBox();
        if(!psw) return;
        purchaseProduct(psw,this.props.product.id,this.props.amount);
        this.ok && this.ok();
    }
}