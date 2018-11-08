/**
 * HoldedProductItem
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { PurchaseHistory } from '../../../store/interface';
import { getLang } from '../../../../pi/util/lang';

interface Props {
    product:PurchaseHistory;
    index:number;
}
export class HoldedProductItem extends Widget {
    public language:any;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.language = this.config.value[getLang()]
        const stateShow = props.product.state === 1 ? this.language.tips[5] : this.language.tips[6];
        const stateBg = props.product.state === 1 ? '' : 'status-gray';
        this.state = {
            stateShow,
            stateBg,
        };
    }
    public productItemClick() {
        popNew('app-view-wallet-financialManagement-holdedFmDetail',this.props);
    }
}