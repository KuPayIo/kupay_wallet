/**
 * HoldedFM
 */
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getPurchaseRecord } from '../../../net/pull';
import { PurchaseHistory } from '../../../store/interface';
import { getStore, register } from '../../../store/memstore';

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
        if (this.props.isActive && getStore('user/conUid')) {
            getPurchaseRecord();
        }
    }
}

// =====================================本地
const localState:any = {};
register('activity/financialManagement/purchaseHistories', (purchaseRecord:PurchaseHistory) => {
    localState.purchaseRecord = purchaseRecord;
    forelet.paint(localState);
});