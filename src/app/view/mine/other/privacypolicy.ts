/**
 * privacy policy
 */
import { Widget } from '../../../../pi/widget/widget';
import { getPrivacyPolicy } from './privacyPolicyText';

export class PrivacyPolicy extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }

    public create() {
        super.create();
        this.props = { 
            privacyPolicy: getPrivacyPolicy() 
        };
    }

    public backPrePage() {
        this.ok && this.ok();
    }
}