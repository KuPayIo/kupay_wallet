/**
 * instalment records
 */
import { Widget } from '../../../../pi/widget/widget';

export class InstalmentRecords extends Widget {
    public ok:() => void;
    constructor() {
        super();
    }
    public goBackClick() {
        this.ok && this.ok();
    }
}