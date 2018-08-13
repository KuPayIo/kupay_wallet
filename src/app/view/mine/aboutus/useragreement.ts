/**
 * user agreement
 */
import { Widget } from '../../../../pi/widget/widget';
import { Config } from '../../base/config';

export class UserAgreement extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.state = { userAgreement: Config.userAgreement };
    }

    public backPrePage() {
        this.ok && this.ok();
    }
}