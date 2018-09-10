/**
 * radioList
 */
// =============================================导入
import { Json } from '../../../../pi/lang/type';
import { Widget } from '../../../../pi/widget/widget';
// ================================================导出
export class ItemList extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }

    public setProps(props: Json, oldProps: Json): void {
        super.setProps(props, oldProps);
        this.state = {
            selected:this.props.selected ? this.props.selected :0
        };
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    public changeSelect(ind:number) {
        this.state.selected = ind;
        this.paint();
    }
}