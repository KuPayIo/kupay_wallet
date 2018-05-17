/**
 * 带输入提示输入框的逻辑处理
 */
import { Widget } from '../../widget/widget';
import { notify } from '../../widget/event';
import { click } from '../../widget/scroller/dom';

interface TipList{
    value:string;//匹配文字
}

interface Props {
    tipList:Array<TipList>;//提示列表
}
interface State{
    currentValue:string;
    showTips:boolean;
    showTipList:Array<TipList>;//展示的list
}
export class InputAutocomplete extends Widget {
    public props: Props;
    constructor() {
        super();
    }
    public setProps(props:Props,oldProps:Props){
        super.setProps(props,oldProps);
        this.state = {
            currentValue:"",
            showTips:false,
            showTipList:props.tipList
        }
    }
    public autoCompleteItemClickListener(event:any,text){
        this.state.currentValue = text;
        this.state.showTips = false;
        notify(event.node,"ev-input-select",{value:this.state.currentValue});
        this.paint(true);
    }
    public focus(){
        this.state.showTips = true;
        this.state.showTipList = this.props.tipList.filter((v)=>{
            return v.value.indexOf(this.state.currentValue) !== -1;
        });
        this.paint();
    }
    public blur(event:any){
        this.state.showTips = false;
        this.paint();
    }

    public change(event:any){
        let currentValue = event.value;
        this.state.currentValue = currentValue.trim();
        if(this.state.currentValue.length === 0){
            this.state.showTipList = this.props.tipList;
            this.paint();
            return;
        }
        this.state.showTipList = this.props.tipList.filter((v)=>{
            return v.value.indexOf(currentValue) !== -1;
        });
        this.paint();
    }

}
