/**
 * privacy policy
 */
import { Widget } from '../../../../pi/widget/widget';
import { find } from '../../../store/store';
import { Config } from '../../base/config';

export class PrivacyPolicy extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }

    public create() {
        super.create();
        let cfg = this.config.value.simpleChinese;
        const lan = find('languageSet');
        if (lan) {
            cfg = this.config.value[lan.languageList[lan.selected]];
        }
        this.state = { 
            privacyPolicy: Config.privacyPolicy,
            cfgData:cfg 
        };
    }

    public backPrePage() {
        this.ok && this.ok();
    }
}