/**
 * application details
 */
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