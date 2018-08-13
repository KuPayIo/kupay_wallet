/**
 * privacy agreement
 */
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { updateStore } from '../../store/store';
import { Config } from '../base/config';

export class PrivacyAgreement extends Widget {
    public ok: () => void;
    constructor() {
        super();

    }

    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            userProtocolReaded: false,
            agreement: Config.userAgreement

        };
    }

    public checkBoxClick(e: any) {
        this.state.userProtocolReaded = (e.newType === 'true' ? true : false);
        this.paint();
    }

    public readedClick() {
        if (!this.state.userProtocolReaded) {
            return;
        }
        updateStore('readedPriAgr', true);
        popNew('app-view-guidePages-displayPage');
        this.ok && this.ok();
    }
}