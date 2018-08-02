/**
 * 输入框的逻辑处理
 * 
 * 
 * ts与input_search一致，需考虑合并处理
 */
import { notify } from '../../../pi/widget/event';
import { getRealNode } from '../../../pi/widget/painter';
import { Widget } from '../../../pi/widget/widget';
import { calcTextareaHeight } from './calcTextareaHeight';

interface Props {
    input: string;// 初始内容
    placeHolder: string;// 提示文字
    disabled: boolean;// 是否禁用
    clearable: boolean;// 是否可清空
    itype: string;// text textarea password
    rows: number;// 输入框行数，只对 itype="textarea" 有效
    autosize: boolean;// 自适应高度
    style: string;// 样式
    autofocus: boolean;// 自动获取焦点
}

interface State {
    currentValue: string;
    hovering: boolean;
    focused: boolean;
    showClear: object;
    styleStr: string;// 样式设置
}
export class Input extends Widget {
    public props: Props;
    public state: State;
    constructor() {
        super();
    }
    public setProps(props: Props, oldProps: Props) {
        super.setProps(props, oldProps);
        let styleStr = '';
        if (props && props.style) {
            styleStr += props.style;
        }
        let currentValue = '';
        if (props.input) {
            currentValue = props.input;
        }
        this.state = {
            currentValue,
            hovering: false,
            focused: false,
            showClear: this.showClear.bind(this),
            styleStr
        };
        if (oldProps) {
            this.changeInputValue();
        }
    }

    public change(event: any) {
        const currentValue = event.currentTarget.value;
        this.state.currentValue = currentValue;
        if (this.props.itype === 'textarea' && this.props.autosize) {
            this.setTextareaHeight();
        }
        notify(event.node, 'ev-input-change', { value: this.state.currentValue });
        this.changeInputValue();
        // this.paint();
    }
    public blur(event: any) {
        this.state.focused = false;
        notify(event.node, 'ev-input-blur', {});
        this.paint();
    }
    public focus(event: any) {
        this.state.focused = true;
        notify(event.node, 'ev-input-focus', {});
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
            !this.props.disabled;
    }

    // 清空文本框
    public clearClickListener(event: any) {
        this.state.currentValue = '';
        notify(event.node, 'ev-input-clear', {});
        this.paint(true);
    }

    // 设置textarea的高
    public setTextareaHeight() {
        const child = (<any>this.tree).children[0].children[0];
        const childNode = getRealNode(child);
        const result = calcTextareaHeight(childNode);
        childNode.style.height = result.height;
        childNode.style.minHeight = result.minHeight;
    }
    // 设置input value
    public changeInputValue() {
        const child = (<any>this.tree).children[0].children[0];
        const childNode = getRealNode(child);
        (<any>childNode).value = this.state.currentValue;
    }
}
