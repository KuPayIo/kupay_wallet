/**
 * 单选框的逻辑处理
 */
import { Widget } from '../../widget/widget';
import { notify } from '../../widget/event';

interface Props {
    labelIndex: number;//当前单选框下标
    text:string;//Radio显示文本
    checkedIndex:number;//选中的下标
    disabled:boolean;//是否禁用
}

export class Radio extends Widget {
    public props: Props;
    constructor() {
        super();
    }
    public clickListenter(event: any) {
        if(this.props.disabled) return;
        if(this.props.labelIndex === this.props.checkedIndex) return;
        this.props.checkedIndex = this.props.labelIndex;
        notify(event.node, 'ev-radio-change', { checkedIndex:this.props.checkedIndex});
        this.paint();
    }
}
