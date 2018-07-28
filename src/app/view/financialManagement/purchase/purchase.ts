/**
 * 认购页面
 */
import { Widget } from '../../../../pi/widget/widget';
export class ProductDetail extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public setProps(props: any, oldProps: any) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init() {
        this.state = {};  
    }
    public goBackPage() {
        this.ok && this.ok();
    }
}