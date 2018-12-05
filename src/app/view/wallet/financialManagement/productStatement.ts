/**
 * 理财声明
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { Product } from '../../../store/interface';
import { getStaticLanguage } from '../../../utils/tools';
interface Props {
    product:Product;
    amount:number;
    fg:number; // 点击阅读声明进入为1，否则是点击购买进入
}
export class ProductStatement extends Widget {
    public ok:() => void;
    public props:any;
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.props = {
            ...this.props,
            statement:getStaticLanguage().notice,
            readed:false
        };
    }
    public checkBoxClick(e: any) {
        this.props.readed = (e.newType === 'true' ? true : false);
        this.paint();
    }

    public nextClick() {
        if (!this.props.readed) return;
        if (!this.props.fg) {
            popNew('app-view-wallet-financialManagement-purchase',{ product:this.props.product,amount:this.props.amount });
        }
        this.ok && this.ok();
    }
    public closePage() {
        this.ok && this.ok();
    }
}