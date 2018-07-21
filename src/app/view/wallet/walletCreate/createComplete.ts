/**
 * creation complete
 */
import { Widget } from '../../../../pi/widget/widget';
import { getLocalStorage } from '../../../utils/tools';
import { popNew } from '../../../../pi/ui/root';
export class CreateComplete extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init(): void {

    }
    public backPrePage() {
        this.ok && this.ok();
        const lockScreenPsw = getLocalStorage('lockScreenPsw');
        if (!lockScreenPsw) {
            popNew('app-view-guidePages-setLockScreenScret');
        } else {
            popNew('app-view-app');
        }
    }

}
