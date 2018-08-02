/**
 * 累计收益
 */
import { Widget } from '../../../../pi/widget/widget';
export class CumulativeIncome extends Widget {
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
            totalIncom:'0.0000'
        };
    }
    public goBackPage() {
        this.ok && this.ok();
    }
}