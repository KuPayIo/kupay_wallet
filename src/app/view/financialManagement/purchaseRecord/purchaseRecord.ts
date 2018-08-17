/**
 * 我的理财购买记录
 */
// ===============================================导入
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { register } from '../../../store/store';
// ================================================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class PurchaseRecord extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public setProps(props: any, oldProps: any) {
        super.setProps(props,oldProps);
        this.state.recordList = this.props.record;
    }
    public init() {
        this.state = {
            recordList:[]
        };
    }
    public toDetail(i:any) {

        popNew('app-view-financialManagement-purchaseRecord-recordDetail',{ i,item:this.state.recordList[i] });
    }
    public goBackPage() {
        this.ok && this.ok();
    }

}
// =========================本地
register('purchaseRecord', async (purchaseRecord) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.state.recordList = purchaseRecord;
        w.paint();
    }
    
});