/**
 * 持有资产
 */
import { Widget } from '../../../../pi/widget/widget';
export class Index extends Widget {
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
            totalAssests:'0.0000'
        };
    }
    public goBackPage() {
        this.ok && this.ok();
    }
}