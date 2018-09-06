/**
 * 基础列表项组件
 * {"name":"用户名","describe":"未设置"}
 * name:左侧标题
 * describe：右侧描述，可选
 */
// ================================ 导入
import { notify } from '../../../pi/widget/event';
import { Widget } from '../../../pi/widget/widget';

interface Props {
    name:string;
    describe?:string;
    style?:string;
}
// ================================ 导出

export class BasicItem extends Widget {
    public props:Props;
    public ok: () => void;
    constructor() {
        super();
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    public doTap(event:any) {
        notify(event.node,'ev-btn-tap',{});
    }
}
