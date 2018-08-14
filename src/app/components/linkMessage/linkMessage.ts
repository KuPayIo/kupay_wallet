/**
 * 没有钱包，去创建提示框
 */
interface Props {
    tip:string;
    linkTxt:string;
    linkCom:string;
}
// =========================================导入
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
// =======================================导出
export class LinkMessage extends Widget {
    public props: Props;
    public ok: () => void;

    constructor() {
        super();
    }
    public closeSelf() {
        this.ok && this.ok();
    }
    public clickMainBox(e:any) {
        console.log(e);
    }
    public linkTo() {
        popNew(this.props.linkCom);
        this.ok && this.ok();
    }
}
