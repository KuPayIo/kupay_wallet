/**
 * HoldedFM
 */
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { callGetPurchaseRecord,getStoreData, registerStore } from '../../../middleLayer/wrap';
import { PurchaseHistory } from '../../../publicLib/interface';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface Props {
    isActive:boolean;
}
export class HoldedFM extends Widget {
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init() {
        this.props = {
            ...this.props,
            purchaseRecord:[]
        };
        getStoreData('user/id').then(uid => {
            if (this.props.isActive && uid) {
                callGetPurchaseRecord();
            }
        });
        
    }

    public updatePurchaseRecord(purchaseRecord:PurchaseHistory[]) {
        this.props.purchaseRecord = purchaseRecord;
        this.paint();
    }

}

// =====================================本地
registerStore('activity/financialManagement/purchaseHistories', (purchaseRecord) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updatePurchaseRecord(purchaseRecord);
    }
    
});