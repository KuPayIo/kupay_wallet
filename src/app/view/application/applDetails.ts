/**
 * application details
 */
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';

export class ApplicationDetails extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }

    public backPrePage() {
        this.ok && this.ok();
    }
}