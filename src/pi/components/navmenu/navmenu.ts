/**
 * 导航菜单栏
 * mod 设置导航栏的类型，vertical和horizontal，默认是vertical垂直导航栏
 * width 导航栏宽度设置，最小为240px 
 * arr 数组，没有子模块，直接传递包含title的json数据，有子模块传递包含submenu，subtitle及arr的json数据
 * 可以多层嵌套导航栏
 */
import {Widget} from "../../widget/widget"


interface Props　{
	mod:string,
	width:number,
	arr:any[]
}

export class navmenu extends Widget {
	public props: Props;
	constructor () {
		super();
		this.props = {
			mod:"vertical",
			width:240,
			arr:[
				{index:"1",title:"选项1",isActivated:true}, 
				{index:"2",title:"选项2"}, 
				{
					index:"3",
					submenu:true,
					subtitle:"选项3",
					title:"选项3",
					arr:[
						{index:"3-1",title:"选项3-1"}, 
						{index:"3-2",title:"选项3-2",isdisabled:true}, 
						{
							index:"3-3",
							submenu:true,
							subtitle:"选项3-3",
							arr:[
								{index:"3-3-1",title:"选项3-3-1"},
								{index:"3-3-2",title:"选项3-3-2"}
							]
						}
					]
				}
			]
		}
	}

	// vertical模式下清除active标记
	public clearActive(data,index){
		for(let i in data){
			if(index!=data[i].index){
				data[i].isActivated = false;							
			}
			if(data[i].submenu){
				this.clearActive(data[i].arr,index);
			}
		}
	}

	// horizontal模式下清除active标记
	public clearActive1(data,index){
		for(let i in data){			
			let reg = new RegExp("^"+data[i].index);
			if(index!=data[i].index && !reg.test(index)){
				data[i].isActivated = false;							
			}else{
				data[i].isActivated = true;
			}
			if(data[i].submenu){
				this.clearActive1(data[i].arr,index);
			}
		}
	}

	// vertical模式下事件监听
	public doClick(event: any){	
		this.clearActive(this.props.arr,`${event.index}`);
		console.log(this.props);
		this.paint();
	}

	// horizontal模式下事件监听
	public doClick1(event:any){
		this.clearActive1(this.props.arr,`${event.index}`);
		this.paint();
	}
}