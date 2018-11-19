/**
 * privacy policy
 */
import { Widget } from '../../../../pi/widget/widget';
import { getStaticLanguage } from '../../../utils/tools';

export class PrivacyPolicy extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }

    public create() {
        super.create();
        this.state = { 
            privacyPolicy: getStaticLanguage().privacyPolicy, 
        };
    }

    public backPrePage() {
        this.ok && this.ok();
    }
}