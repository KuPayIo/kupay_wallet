/**
 * creation complete
 */
import { notify } from '../../../../pi/widget/event';
import { Widget } from '../../../../pi/widget/widget';
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
