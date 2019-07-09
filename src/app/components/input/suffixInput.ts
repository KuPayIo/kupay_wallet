/**
 * 输入框的逻辑处理
 * {input:"",placehold:"",disabled:false,clearable:false,itype:"text",style:"",autofacus:false}
 * input?: 初始内容
 * placeHolder?: 提示文字
 * disabled?: 是否禁用
 * clearable?: 是否可清空
 * itype?: 输入框类型 text number password
 * style?: 样式
 * 外部可监听 ev-input-change，ev-input-blur，ev-input-focus，ev-input-clear事件
 */
import { getLang } from '../../../pi/util/lang';
import { notify } from '../../../pi/widget/event';
import { getRealNode } from '../../../pi/widget/painter';
import { Widget } from '../../../pi/widget/widget';

interface Props {
    available:boolean;// 输入的内容是否可用,false 后缀显示叉 true显示勾
    input?:string;
    placeHolder?:string;
    clearable?:boolean;
    itype?:string;
    style?:string;
    autofocus?:boolean;
    closeEye?:boolean;
    isShow?:boolean;
    isCenter?:boolean;
}

interface State {
    currentValue:string;
    focused:boolean;
    showClear:boolean;
    inputLock:boolean;
}
export class SuffixInput extends Widget {
    public props: Props;
    public state: State;
    constructor() {
        super();
    }
    public create() {
        this.state = {
            currentValue:'',
            focused: false,
            showClear:false,
            inputLock:false
        };
    }
    public setProps(props: Props, oldProps: Props) {
        super.setProps(props,oldProps);
        if (props.placeHolder) {
            this.props.placeHolder = this.props.placeHolder[getLang()];
        }
        if (props.input) {
            this.state.currentValue = props.input;
        }
        this.props.closeEye = true;
    }

    public change(event:any) {
        if (this.state.inputLock) {
            return;
        }
        const currentValue = event.currentTarget.value;
        this.state.currentValue = currentValue;
        this.state.showClear = this.props.clearable && this.state.currentValue !== '' && this.state.focused;
        
        notify(event.node,'ev-input-change',{ value:this.state.currentValue });
        this.changeInputValue();
        this.paint();
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
    
    // 清空文本框
    public clearClickListener(event:any) {
        if (this.props.available) return;
        this.state.currentValue = '';
        this.state.showClear = false;
        notify(event.node,'ev-input-clear',{});
        this.changeInputValue();
        this.paint();
    }

    // 设置input value
    public changeInputValue() {
        const child = (<any>this.tree).children[0];
        const childNode = getRealNode(child);
        (<any>childNode).value = this.state.currentValue;
    }
     // 判断是否显示密码
    public showPassword() {
        this.props.closeEye = !this.props.closeEye;
        this.paint();
    }

    /**
     * 用户开始进行非直接输入(中文输入)的时候触发，而在非直接输入结束。
     */
    public compositionstart() {
        if (this.props.itype === 'text') {
            this.state.inputLock = true;
        }
    }

    /**
     * 用户输入完成,点击候选词或确认按钮时触发
     */
    public compositionend(e: any) {
        this.state.inputLock = false;
        this.change(e);
    }
}
