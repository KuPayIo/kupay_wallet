/**
 * radioList
 */
// =============================================导入
import { Json } from '../../../../pi/lang/type';
import { Widget } from '../../../../pi/widget/widget';
// ================================================导出
export class ItemList extends Widget {
    public ok: (ind:number) => void;
   
    public setProps(oldProps:Json,props:Json) {
        super.setProps(oldProps,props);
        this.state = {
            selected:this.props.selected
        };
    }

    public backPrePage() {
        this.ok && this.ok(this.state.selected);
    }

    public changeSelect(e:any) {
        this.state.selected = e.value;
    }
}