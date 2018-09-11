/**
 * radioList
 * {list:[],selected:1}
 * list:数据列表
 * selected:被选中的是第几项，不传则不选中任何一项
 */
// =============================================导入
import { Json } from '../../../pi/lang/type';
import { Widget } from '../../../pi/widget/widget';
// ================================================导出
interface Props {
    list:any[];  
    selected?:number;
}
export class RadioList extends Widget {
    public props:Props;
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