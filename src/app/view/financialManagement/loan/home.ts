import { Widget } from "../../../../pi/widget/widget";
import { popNew } from "../../../../pi/ui/root";

export class LoanHome extends Widget{
    constructor(){
        super();
    }

    public instalmentRecordsClick(){
        popNew("app-view-financialManagement-loan-instalmentRecords");
    }

    public historicalBillClick(){
        popNew("app-view-financialManagement-loan-historicalBill");
    }
}