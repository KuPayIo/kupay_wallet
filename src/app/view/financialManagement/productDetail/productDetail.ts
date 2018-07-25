/**
 * 理财产品详情页面
 */
import { Widget } from '../../../../pi/widget/widget';
export class ProductDetail extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {};  
    }
    public goBackPage() {
        this.ok && this.ok();
    }
}