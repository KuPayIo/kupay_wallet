/**
 * index 唯一标识
 * title 名称
 * submenu 是否含有子模块
 * subtitle 模块组的名称
 * isActivated 是否选中，默认未选中
 * isdisable 是否不可选择，默认可选择
 * 可以多层嵌套导航栏
 */
import {Widget} from "../../widget/widget"
import { notify } from "../../widget/event";
import { getRealNode } from "../../widget/painter";


interface Props　{
	index:string,
	title:string,
	submenu:boolean,
	subtitle:string,
	isActivated:boolean,
	isdisabled:boolean
}

interface State{
	left:number,
	top:number,
	isopen:boolean
}

export class navmenu extends Widget {
	public props: Props;
	constructor () {
		super();
		this.props = {
			index:"1",
			title:"group1",
			submenu:false,
			subtitle:"",
			isActivated:false,
			isdisabled:false
		}
		this.state = {
			left:0,
			top:0,
			isopen:false
		}
	}

	public doClick(event: any){
		if(this.props.isdisabled){
			return;
		}
		this.props.isActivated = true;
		this.paint();
		notify(event.node, "ev-navmenu-click", {index:this.props.index});
	}

	public itemMouseover(event:any){
		this.state.left = getRealNode(event.node).offsetWidth;
		this.state.top = getRealNode(event.node).offsetTop;	
		this.state.isopen = true;		
		this.paint();
	}

	public itemMouseout(event:any){
		this.state.isopen = false;
		this.paint();
	}

}