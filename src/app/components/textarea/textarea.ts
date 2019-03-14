/**
 * 输入框的逻辑处理
 */
import { getLang } from '../../../pi/util/lang';
import { notify } from '../../../pi/widget/event';
import { getRealNode } from '../../../pi/widget/painter';
import { Widget } from '../../../pi/widget/widget';

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

export const loadDirCompleted = () => {
    console.log(1111111111);
};

export class Textarea extends Widget {
    public props: any;
    constructor() {
        super();
        console.log('textarea --------- constructor');
    }
    public setProps(props: Props, oldProps: Props) {
        super.setProps(props,oldProps);
        let styleStr = '';
        if (props && props.style) {
            for (const key in props.style) {
                styleStr += `${key}:${props.style[key]};`;
            }
        }
        if (props.placeHolder) {
            this.props.placeHolder = this.props.placeHolder[getLang()];
            console.log('textarea ---------',this.props.placeHolder);
        }
        let currentValue = '';
        if (props.input) {
            currentValue = props.input;
        }
        this.props = {
            ...this.props,
            currentValue,
            hovering: false,
            focused: false,
            showClear:this.showClear.bind(this),
            styleStr
        };
    }

    public change(event:any) {
        const currentValue = event.currentTarget.value;
        this.props.currentValue = currentValue;
        notify(event.node,'ev-input-change',{ value:this.props.currentValue });
        this.changeInputValue();
        // this.paint();
    }
    public blur(event:any) {
        this.props.focused = false;
        notify(event.node,'ev-input-blur',{});
        this.paint();
    }
    public focus(event:any) {
        this.props.focused = true;
        notify(event.node,'ev-input-focus',{});
        this.paint();
    }
    public mouseover() {
        this.props.hovering = true;
        this.paint();
    }
    public mouseleave() {
        this.props.hovering = false;
        this.paint();
    }
    public showClear() {
        if (!this.props) return;

        return this.props && this.props.clearable &&
          !this.props.disabled &&
          this.props.currentValue !== '' &&
          (this.props.focused || this.props.hovering);
    }
    
    // 清空文本框
    public clearClickListener(event:any) {
        this.props.currentValue = '';
        notify(event.node,'ev-input-clear',{});
        this.paint(true);
    }

    // 设置input value
    public changeInputValue() {
        const child = (<any>this.tree).children[0].children[0];
        const childNode = getRealNode(child);
        (<any>childNode).value = this.props.currentValue;
    }
}
