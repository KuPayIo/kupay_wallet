/**
 * HoldedProductItem
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { PurchaseRecordOne } from '../../../store/interface';
import { getLanguage } from '../../../utils/tools';

interface Props {
    product:PurchaseRecordOne;
}
export class HoldedProductItem extends Widget {
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        console.log(this.props.product);
        const cfg = getLanguage(this);
        const stateShow = props.product.state === 1 ? cfg.tips[5] : cfg.tips[6];
        const stateBg = props.product.state === 1 ? '' : 'status-gray';
        this.state = {
            stateShow,
            stateBg,
            cfgData:cfg
        };
    }
    public productItemClick() {
        popNew('app-view-wallet-financialManagement-holdedFmDetail',{ product:this.props.product });
    }
}