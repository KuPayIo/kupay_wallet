/**
 * 单选框组的逻辑处理
 */
import { Widget } from '../../widget/widget';
import { notify } from '../../widget/event';

interface radioObj {
    text:string;//Radio显示文本
    disabled:boolean;//是否禁用
}

interface Props {
    checkedIndex:number;//默认选中的下标
    radioList:radioObj[];//单选框数组列表
}

export class RadioGroup extends Widget {
    public props: Props;
    constructor() {
        super();
    }
    public radioChangeListener(event:any){
        this.props.checkedIndex = event.checkedIndex;
        this.paint();
    }
}
