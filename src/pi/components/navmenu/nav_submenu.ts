/**
 * 导航菜单栏
 * mod 设置导航栏的类型，vertical和horizontal，默认是vertical垂直导航栏
 * isopen 子模块是否展开，默认不展开
 * arr 数组，没有子模块，直接传递包含title的json数据，有子模块传递包含submenu，subtitle及arr的json数据
 * left和top 表示子模块要显示的绝对位置
 * 可以多层嵌套导航栏
 * 
 * 
 * 最外层事件监听清空参数
 */
import {Widget} from "../../widget/widget"
import { getRealNode } from "../../widget/painter";


interface Props　{
	mod:string,
	isopen:boolean,
	isActivated:boolean,
	arr:any[]
}

interface State {
	left:number,
	top:number
}

export class navmenu extends Widget {
	public props: Props;
	public state: State;
	constructor () {
		super();
		this.props = {
			mod:"vertical",
			isopen:false,
			isActivated:false,
			arr:[]
		}
		this.state = {
			left:0,
			top:0			
		}
	}

	public subClick(event:any){
		this.props.isopen = !this.props.isopen;
		this.paint();
	}

	public subMouseover(event:any){
		this.state.left = getRealNode(event.node).offsetLeft;
		this.state.top = getRealNode(event.node).offsetTop+getRealNode(event.node).offsetHeight;	
		this.props.isopen = true;
		this.paint();
	}

	public subMouseout(event:any){
		this.props.isopen = false;
		this.paint();
	}

}