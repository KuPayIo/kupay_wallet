/**
 * creation complete
 */
import { Widget } from '../../../../pi/widget/widget';
import { notify } from '../../../../pi/widget/event';
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
    }

}
