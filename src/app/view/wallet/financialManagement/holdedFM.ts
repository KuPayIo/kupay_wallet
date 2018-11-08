/**
 * HoldedFM
 */
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getPurchaseRecord } from '../../../net/pull';
import { PurchaseHistory } from '../../../store/interface';
import { register } from '../../../store/memstore';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface Props {
    isActive:boolean;
}
export class HoldedFM extends Widget {
    public language:any;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init() {
        this.language = this.config.value[getLang()];
        this.state = {
            purchaseRecord:[]
        };
        if (this.props.isActive) {
            getPurchaseRecord();
        }
    }

    public updatePurchaseRecord(purchaseRecord:PurchaseHistory[]) {
        this.state.purchaseRecord = purchaseRecord;
        this.paint();
    }

}

// =====================================本地
register('activity/financialManagement/purchaseHistories', async (purchaseRecord) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updatePurchaseRecord(purchaseRecord);
    }
    
});