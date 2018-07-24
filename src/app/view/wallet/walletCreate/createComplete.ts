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
        if (!getLocalStorage('lockScreenPsw')) {
            popNew('app-view-guidePages-setLockScreenScret', { jump: true });
        }
    }

}
