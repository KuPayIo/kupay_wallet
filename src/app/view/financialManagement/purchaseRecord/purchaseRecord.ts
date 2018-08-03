/**
 * 我的理财购买记录
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
export class PurchaseRecord extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            recordList:[{
                productName:'ETH资管第1期',
                amount:'2',
                profit:'0.0023',
                days:'2',
                state:'收益中'
            },{
                productName:'ETH资管第1期',
                amount:'2',
                profit:'0.0023',
                days:'2',
                state:'结束'
            }]
        };
    }
    public toDetail() {
        popNew('app-view-financialManagement-purchaseRecord-recordDetail');
    }
    public goBackPage() {
        this.ok && this.ok();
    }

}