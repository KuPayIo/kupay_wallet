/**
 * history bill
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';

export class HistoricalBill extends Widget {
    public ok:() => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public goBackClick() {
        this.ok && this.ok();
    }
    public init() {
        this.state = {
            billList:[{
                month:5,
                date:'2018/04/20-2018/05/19',
                value:1966.67
            },{
                month:4,
                date:'2018/03/20-2018/04/19',
                value:1966.67
            },{
                month:3,
                date:'2018/02/20-2018/03/19',
                value:1966.67
            },{
                month:2,
                date:'2018/01/20-2018/02/19',
                value:1966.67
            }]
        };
    }

    public billItemClick() {
        popNew('app-view-financialManagement-loan-billDetails');
    }
}