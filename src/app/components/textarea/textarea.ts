/**
 * 输入框的逻辑处理
 */
import { notify } from '../../../pi/widget/event';
import { getRealNode } from '../../../pi/widget/painter';
import { Widget } from '../../../pi/widget/widget';
import { getLang } from '../../../pi/util/lang';

interface Props {
    input:string;// 初始内容
    placeHolder:string;// 提示文字
    disabled:boolean;// 是否禁用
    clearable:boolean;// 是否可清空
    rows:number;// 输入框行数，只对 itype="textarea" 有效
    autosize:boolean;// 自适应高度
    prepend:string;// 前置内容
    append:string;// 后置内容
    style:Object;// 样式
    autofocus:boolean;// 自动获取焦点
}

interface State {
    currentValue:string;
    hovering:boolean;
    focused:boolean;
    showClear:object;
    styleStr:string;// 样式设置
}
export class Input extends Widget {
    public props: Props;
    public state: State;
    constructor() {
        super();
    }
    public setProps(props: Props, oldProps: Props) {
        super.setProps(props,oldProps);
        let styleStr = '';
        if (props && props.style) {
            for (const key in props.style) {
                styleStr += `${key}:${props.style[key]};`;
            }
        }
        if(props.placeHolder){
            this.props.placeHolder = this.props.placeHolder[getLang()];
        }
        let currentValue = '';
        if (props.input) {
            currentValue = props.input;
        }
        this.state = {
            currentValue,
            hovering: false,
            focused: false,
            showClear:this.showClear.bind(this),
            styleStr
        };
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
    public mouseover() {
        this.state.hovering = true;
        this.paint();
    }
    public mouseleave() {
        this.state.hovering = false;
        this.paint();
    }
    public showClear() {
        if (!this.props) return;

        return this.props && this.props.clearable &&
          !this.props.disabled &&
          this.state.currentValue !== '' &&
          (this.state.focused || this.state.hovering);
    }
    
    // 清空文本框
    public clearClickListener(event:any) {
        this.state.currentValue = '';
        notify(event.node,'ev-input-clear',{});
        this.paint(true);
    }

    // 设置input value
    public changeInputValue() {
        const child = (<any>this.tree).children[0].children[0];
        const childNode = getRealNode(child);
        (<any>childNode).value = this.state.currentValue;
    }
}
