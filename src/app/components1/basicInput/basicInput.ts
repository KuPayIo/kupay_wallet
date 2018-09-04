/**
 * 基础输入框组件
 * {prepend:"红包个数",placeholder:"0",itype:"number",append:"个",style:""}
 * prepend:前置标题
 * placeholder:输入框提示语
 * append:后置单位
 * itype:输入数据类型，text，number，password
 * style:额外的CSS样式
 */
import { Widget } from '../../../pi/widget/widget';

interface Props {
    prepend: string;
    placeholder?: string;
    append?: string;
    itype?:string;
    style?:string;
}

export class BasicInput extends Widget {
    public props: Props;
    constructor() {
        super();
    }
}
