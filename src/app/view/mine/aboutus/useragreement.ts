/**
 * user agreement
 */
import { Widget } from '../../../../pi/widget/widget';

export class UserAgreement extends Widget {
    public ok: () => void;
    constructor() {
        super();       
    }

    public backPrePage() {
        this.ok && this.ok();
    }
}