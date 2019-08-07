/**
 * privacy policy
 */
import { Widget } from '../../../../pi/widget/widget';
import { getModulConfig } from '../../../publicLib/modulConfig';
import { getIosPrivacyPolicy, getPrivacyPolicy } from './privacyPolicyText';

export class PrivacyPolicy extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }

    public create() {
        super.create();
        const isIos = getModulConfig('IOS');
        this.props = { 
            privacyPolicy: isIos ? getIosPrivacyPolicy() : getPrivacyPolicy() 
        };
    }

    public backPrePage() {
        this.ok && this.ok();
    }
}