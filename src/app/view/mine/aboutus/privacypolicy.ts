/**
 * privacy policy
 */
import { Widget } from '../../../../pi/widget/widget';

export class PrivacyPolicy extends Widget {
    public ok: () => void;
    constructor() {
        super();       
    }

    public backPrePage() {
        this.ok && this.ok();
    }
}