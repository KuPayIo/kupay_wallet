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
    statement:any;
    readed:boolean;
    fg:number; // 点击阅读声明进入为1，否则是点击购买进入
}
export class ProductStatement extends Widget {
    public ok:() => void;

    public props:any = {
        statement:getStaticLanguage() .notice,
        readed:false,
        fg:1
    };
    public setProps(props:any) {
        this.props = {
            ...this.props,
            fg:props.fg
        };
        super.setProps(this.props);
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