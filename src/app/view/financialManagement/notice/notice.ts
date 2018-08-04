/**
 * 理财产品首页
 */
import { Widget } from '../../../../pi/widget/widget';
export class Notice extends Widget {
    public ok: (r:any) => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            isAgree:false
        };
    }
    public checkBoxClick() {
        this.state.isAgree = !this.state.isAgree;
        this.paint();
    }
    public agreeClicked() {
        if (!this.state.isAgree) {
            return;
        }
        this.ok && this.ok(this.state.isAgree);
    }

}