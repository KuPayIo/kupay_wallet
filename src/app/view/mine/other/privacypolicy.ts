/**
 * privacy policy
 */
import { Widget } from '../../../../pi/widget/widget';
import { Config } from '../../base/config';

export class PrivacyPolicy extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }

    public create() {
        super.create();
        this.state = { privacyPolicy: Config.privacyPolicy };
    }

    public backPrePage() {
        this.ok && this.ok();
    }
}