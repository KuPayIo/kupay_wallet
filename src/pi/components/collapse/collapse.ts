/**
 * Collapse 折叠面板的逻辑处理
 */
import { Widget } from '../../widget/widget';
import { notify } from '../../widget/event';
import { getRealNode } from '../../widget/painter';

interface CollapseItem{
    title:string;//标题
    htmlStr:string;//内容
}
interface Props{
    htmlStrList:Array<CollapseItem>;//html标签string
    accordion?:boolean;//是否以手风琴模式显示
}

interface State{
    currentExpIndex?:number;//当前展开item下标   accordion = true 使用
    lastExpIndex?:number;//上一个展开的item
    currentExpArr?:Array<boolean>;//当前展开item数组 accordion = false 使用
    isExpanded:object;//判断当前item是否展开
}
export class Collapse extends Widget {
    public props: Props;
    public state: State;
    constructor() {
        super();
    }
    public setProps(props: Props, oldProps: Props){
        super.setProps(props,oldProps);
        if(props.accordion){
            this.state = {
                currentExpIndex:-1,
                lastExpIndex:-1,
                isExpanded:this.isExpanded.bind(this)
            }
        }else{
            let currentExpArr = [];
            for(let i = 0; i < props.htmlStrList.length;i++){
                currentExpArr[i] = false;
            }
            this.state = {
                currentExpArr,
                isExpanded:this.isExpanded.bind(this)
            }
        }
        
    }
    
    public clickItemListener(event:any,index:number){
        if(this.props.accordion){
            this.state.lastExpIndex = this.state.currentExpIndex;
            if(this.state.currentExpIndex === index){
                this.state.currentExpIndex = -1;
            }else{
                this.state.currentExpIndex = index;
            }
        }else{
            this.state.currentExpArr[index] = !this.state.currentExpArr[index];
        }
        this.setHiddenContentHeight(index,this.isExpanded(index));
        let activeIndexs;
        if(this.props.accordion){
            activeIndexs = this.state.currentExpIndex;
        }else{
            activeIndexs = [];
            for(let i = 0;i < this.state.currentExpArr.length;i++){
                if(this.state.currentExpArr[i]){
                    activeIndexs.push(i);
                }
            }
        }
        notify(event.node,"ev-collapse-change",{activeIndexs});
        this.paint();
    }

    //判断当前item是否展开
    public isExpanded(index:number){
        if(this.props.accordion){
            return this.state.currentExpIndex == index;
        }
        return this.state.currentExpArr[index];
    }

    public setHiddenContentHeight(index,isExpanded){
        let currentItemPanel = (<any>this.tree).children[index].children[1];
        let currentItemPanelNode = getRealNode(currentItemPanel);
        if(this.props.accordion && this.state.lastExpIndex !== -1){
            let lastItemPanel = (<any>this.tree).children[this.state.lastExpIndex].children[1];
            let lastItemPanelNode = getRealNode(lastItemPanel);
            lastItemPanelNode.style.height =  "0px";
        }
        if(!isExpanded){
            currentItemPanelNode.style.height =  "0px";
            return;
        }
        let scrollHeight = currentItemPanelNode.scrollHeight;
        currentItemPanelNode.style.height = scrollHeight + "px";
    }
}
