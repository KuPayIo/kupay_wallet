/**
 * 输入框的逻辑处理
 */
import { Widget } from '../../widget/widget';
import { notify } from '../../widget/event';
import { getRealNode } from '../../widget/painter';
import calcTextareaHeight from './calcTextareaHeight';

interface Props{
    input:string;//初始内容
    placeHolder:string;//提示文字
    disabled:boolean;//是否禁用
    clearable:boolean;//是否可清空
    type:string;//text textarea
    rows:number;//输入框行数，只对 type="textarea" 有效
    autosize:boolean;//自适应高度
    prepend:string;//前置内容
    append:string;//后置内容
    style:Object;//样式
}

interface State{
    currentValue:string;
    hovering:boolean;
    focused:boolean;
    showClear:object;
    styleStr:string;//样式设置
}
export class Input extends Widget {
    public props: Props;
    public state: State;
    constructor() {
        super();
    }
    public setProps(props: Props, oldProps: Props){
        super.setProps(props,oldProps);
        let styleStr = "";
        if(props && props.style){
            for(let key in props.style){
                styleStr += `${key}:${props.style[key]};`;
            }
        }
        let currentValue = "";
        if(props.input){
            currentValue = props.input;
        }
        this.state = {
            currentValue,
            hovering: false,
            focused: false,
            showClear:this.showClear.bind(this),
            styleStr
        }
        if(oldProps){
            this.changeInputValue();
        }
    }

    public change(event){
        let currentValue = event.currentTarget.value
        this.state.currentValue = currentValue;
        if(this.props.type === 'textarea' &&  this.props.autosize){
            this.setTextareaHeight();
        }
        notify(event.node,"ev-input-change",{value:this.state.currentValue});
        this.changeInputValue();
        //this.paint();
    }
    public blur(event){
        this.state.focused = false;
        notify(event.node,"ev-input-blur",{});
        this.paint();
    }
    public focus(event){
        this.state.focused = true;
        notify(event.node,"ev-input-focus",{});
        this.paint();
    }
    public mouseover(){
        this.state.hovering = true;
        this.paint();
    }
    public mouseleave(){
        this.state.hovering = false;
        this.paint();
    }
    public showClear(){
        if(!this.props) return;
        return this.props && this.props.clearable &&
          !this.props.disabled &&
          this.state.currentValue !== '' &&
          (this.state.focused || this.state.hovering);
    }
    
    //清空文本框
    public clearClickListener(event:any){
        this.state.currentValue = "";
        notify(event.node,"ev-input-clear",{});
        this.paint(true);
    }

    //设置textarea的高
    public setTextareaHeight(){
        let child = (<any>this.tree).children[0].children[0];
        let childNode = getRealNode(child);
        let result = calcTextareaHeight(childNode);
        childNode.style.height = result.height;
        childNode.style.minHeight = result.minHeight;
    }
    //设置input value
    public changeInputValue(){
        let child = (<any>this.tree).children[0].children[0];
        let childNode = getRealNode(child);
        (<any>childNode).value = this.state.currentValue;
    }
}
