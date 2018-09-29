/**
 * privacy policy
 */
import { Widget } from '../../../../pi/widget/widget';
import { getLanguage, getStaticLanguage } from '../../../utils/tools';

export class PrivacyPolicy extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }

    public create() {
        super.create();
        this.state = { 
            privacyPolicy: getStaticLanguage().privacyPolicy,
            cfgData:getLanguage(this) 
        };
    }

    public backPrePage() {
        this.ok && this.ok();
    }
}