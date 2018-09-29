/**
 * 理财声明
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { Product } from '../../../store/interface';
import { getLanguage, getStaticLanguage } from '../../../utils/tools';
interface Props {
    product:Product;
    amount:number;
}
export class ProductStatement extends Widget {
    public ok:() => void;
    public props:Props;
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            statement:getStaticLanguage().notice,
            readed:false,
            cfgData:getLanguage(this)
        };
    }
    public checkBoxClick(e: any) {
        this.state.readed = (e.newType === 'true' ? true : false);
        this.paint();
    }

    public nextClick() {
        if (!this.state.readed) return;
        popNew('app-view-wallet-financialManagement-purchase',{ product:this.props.product,amount:this.props.amount });
        this.ok && this.ok();
    }
    public closePage() {
        this.ok && this.ok();
    }
}