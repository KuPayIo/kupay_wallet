import { Widget } from '../../../pi/widget/widget';
import { Product } from '../../store/interface';

/**
 * 理财列表item
 */
interface Props {
    product:Product;
}
export class FmListItem extends Widget {
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init() {
        console.log(this.props.product);
    }
}