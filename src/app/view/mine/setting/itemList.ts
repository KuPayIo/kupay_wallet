/**
 * radioList
 */
// =============================================导入
import { Widget } from '../../../../pi/widget/widget';
// ================================================导出
export class ItemList extends Widget {
    public ok: (ind:number) => void;
    constructor() {
        super();
    }

    public backPrePage() {
        this.ok && this.ok(this.props.selected);
    }

    public changeSelect(e:any) {
        this.ok && this.ok(e.value);
    }
}