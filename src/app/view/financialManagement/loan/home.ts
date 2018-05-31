/**
 * loan home page
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';

export class LoanHome extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }

    public instalmentRecordsClick() {
        popNew('app-view-financialManagement-loan-instalmentRecords');
    }

    public historicalBillClick() {
        popNew('app-view-financialManagement-loan-historicalBill');
    }
    public goBackClick() {
        this.ok && this.ok();
    }
}