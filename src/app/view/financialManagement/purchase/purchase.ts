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
        this.state = {
            id : this.props.id,
            inputNum:0,// 输入的认购数量
            managedAccountBalance:0
        }; 
    }
    public goBackPage() {
        this.ok && this.ok();
    }
    public onValueChange(e:any) {
        const value = e.currentTarget.value;
        this.state.inputNum = value;
    }
}