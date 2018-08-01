/**
 * 简单的输入框的逻辑处理
 */
import { notify } from '../../../pi/widget/event';
import { getRealNode } from '../../../pi/widget/painter';
import { Widget } from '../../../pi/widget/widget';

interface Props {
    input:string;// 初始内容
    placeHolder:string;// 提示文字
    itype:string;// text textarea password
    style:string;// 样式
}

interface State {
    currentValue:string;
    focused:boolean;
}
export class InputSimple extends Widget {
    public props: Props;
    public state: State;
    constructor() {
        super();
    }
    public setProps(props: Props, oldProps: Props) {
        super.setProps(props,oldProps);
        let currentValue = '';
        if (props.input) {
            currentValue = props.input;
        }
        this.state = {
            currentValue,
            focused: false
        };
        if (oldProps) {
            this.changeInputValue();
        }
    }

    public change(event:any) {
        const currentValue = event.currentTarget.value;
        this.state.currentValue = currentValue;
        notify(event.node,'ev-input-change',{ value:this.state.currentValue });
        this.changeInputValue();
        // this.paint();
    }
    public blur(event:any) {
        this.state.focused = false;
        notify(event.node,'ev-input-blur',{});
        this.paint();
    }
    public focus(event:any) {
        this.state.focused = true;
        notify(event.node,'ev-input-focus',{});
        this.paint();
    }
    // 设置input value
    public changeInputValue() {
        const child = (<any>this.tree).children[0];
        const childNode = getRealNode(child);
        (<any>childNode).value = this.state.currentValue;
    }
}
