/**
 * 输入框的逻辑处理
 * {input:"",placehold:"",disabled:false,clearable:false,itype:"text",style:"",autofacus:false,maxLength:1}
 * input?: 初始内容
 * placeHolder?: 提示文字
 * disabled?: 是否禁用
 * clearable?: 是否可清空
 * itype?: 输入框类型 text number password
 * style?: 样式
 * autofocus?: 是否自动获取焦点
 * maxLength?: 输入最大长度，仅对text和password类型输入有效
 * 外部可监听 ev-input-change，ev-input-blur，ev-input-focus，ev-input-clear事件
 */
import { notify } from '../../../pi/widget/event';
import { getRealNode } from '../../../pi/widget/painter';
import { Widget } from '../../../pi/widget/widget';

interface Props {
    input?:string;
    placeHolder?:string;
    disabled?:boolean;
    clearable?:boolean;
    itype?:string;
    style?:string;
    autofocus?:boolean;
    maxLength?:number;
}

interface State {
    currentValue:string;
    focused:boolean;
    showClear:boolean;
}
export class Input extends Widget {
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
            focused: false,
            showClear:false
        };
        if (oldProps) {
            this.changeInputValue();
        }
    }

    public change(event:any) {
        const currentValue = event.currentTarget.value;
        this.state.currentValue = currentValue;
        this.state.showClear = this.props.clearable && !this.props.disabled && this.state.currentValue !== '' && this.state.focused;
        
        notify(event.node,'ev-input-change',{ value:this.state.currentValue });
        this.changeInputValue();
        this.paint();
    }
    public blur(event:any) {
        this.state.focused = false;
        this.state.showClear = false;
        notify(event.node,'ev-input-blur',{});
        this.paint();
    }
    public focus(event:any) {
        this.state.focused = true;
        this.state.showClear = this.props.clearable && !this.props.disabled && this.state.currentValue !== '' && this.state.focused;
        notify(event.node,'ev-input-focus',{});
        this.paint();
    }
    
    // 清空文本框
    public clearClickListener(event:any) {
        this.state.currentValue = '';
        notify(event.node,'ev-input-clear',{});
        this.paint(true);
    }

    // 设置input value
    public changeInputValue() {
        const child = (<any>this.tree).children[0];
        const childNode = getRealNode(child);
        (<any>childNode).value = this.state.currentValue;
    }
}
