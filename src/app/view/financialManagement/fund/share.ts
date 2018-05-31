/**
 * fund share Page
 */
import { Widget } from '../../../../pi/widget/widget';

export class FundShare extends Widget {
    public ok:() => void;
    constructor() {
        super();
    }
    public backPrePage() {
        this.ok && this.ok();
    }

    public cancelShareClick() {
        this.ok && this.ok();
    }
} 