/**
 * Collapse 折叠面板的逻辑处理
 */
interface CollapseItem {
    title:string;// 标题
    htmlStr:string;// 内容
}
interface Props {
    htmlStrList:CollapseItem[];// html标签string
    accordion?:boolean;// 是否以手风琴模式显示
}

interface State {
    currentExpIndex?:number;// 当前展开item下标   accordion = true 使用
    lastExpIndex?:number;// 上一个展开的item
    currentExpArr?:boolean[];// 当前展开item数组 accordion = false 使用
    isExpanded:object;// 判断当前item是否展开
}
// ==========================================导入
import { notify } from '../../../pi/widget/event';
import { getRealNode } from '../../../pi/widget/painter';
import { Widget } from '../../../pi/widget/widget';
// ==============================================导出

export class Collapse extends Widget {
    public props: any;
    public state: State;
    constructor() {
        super();
    }
    public setProps(props: Props, oldProps: Props) {
        super.setProps(props,oldProps);
        if (props.accordion) {
            this.props = {
                ...this.props,
                currentExpIndex:-1,
                lastExpIndex:-1,
                isExpanded:this.isExpanded.bind(this)
            };
        } else {
            const currentExpArr = [];
            for (let i = 0; i < props.htmlStrList.length;i++) {
                currentExpArr[i] = false;
            }
            this.props = {
                ...this.props,
                currentExpArr,
                isExpanded:this.isExpanded.bind(this)
            };
        }
        
    }
    
    public clickItemListener(event:any,index:number) {
        if (this.props.accordion) {
            this.props.lastExpIndex = this.props.currentExpIndex;
            if (this.props.currentExpIndex === index) {
                this.props.currentExpIndex = -1;
            } else {
                this.props.currentExpIndex = index;
            }
        } else {
            this.props.currentExpArr[index] = !this.props.currentExpArr[index];
        }
        this.setHiddenContentHeight(index,this.isExpanded(index));
        let activeIndexs;
        if (this.props.accordion) {
            activeIndexs = this.props.currentExpIndex;
        } else {
            activeIndexs = [];
            for (let i = 0;i < this.props.currentExpArr.length;i++) {
                if (this.props.currentExpArr[i]) {
                    activeIndexs.push(i);
                }
            }
        }
        notify(event.node,'ev-collapse-change',{ activeIndexs });
        this.paint();
    }

    // 判断当前item是否展开
    public isExpanded(index:number) {
        if (this.props.accordion) {
            return this.props.currentExpIndex === index;
        }

        return this.props.currentExpArr[index];
    }

    public setHiddenContentHeight(index:number,isExpanded:boolean) {
        const currentItemPanel = (<any>this.tree).children[index].children[1];
        const currentItemPanelNode = getRealNode(currentItemPanel);
        if (this.props.accordion && this.props.lastExpIndex !== -1) {
            const lastItemPanel = (<any>this.tree).children[this.props.lastExpIndex].children[1];
            const lastItemPanelNode = getRealNode(lastItemPanel);
            lastItemPanelNode.style.height =  '0px';
        }
        if (!isExpanded) {
            currentItemPanelNode.style.height =  '0px';

            return;
        }
        const scrollHeight = currentItemPanelNode.scrollHeight;
        currentItemPanelNode.style.height = `${scrollHeight}px`;
    }
}