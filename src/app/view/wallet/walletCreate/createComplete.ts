/**
 * creation complete
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { getLocalStorage } from '../../../utils/tools';
export class CreateComplete extends Widget {
    public ok: () => void;
    constructor() {
        super();
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
