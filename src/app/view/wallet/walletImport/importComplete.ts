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
    public create() {
        super.create();
        this.init();
    }
    public init(): void {
        //
    }
    public backPrePage() {
        if (!getLocalStorage('lockScreenPsw') && !getLocalStorage('jumpLockScreen')) {
            popNew('app-view-guidePages-setLockScreenScret', { jump: true });
        }
        this.ok && this.ok();
    }

}
