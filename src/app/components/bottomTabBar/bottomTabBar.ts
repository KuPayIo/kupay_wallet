import { Widget } from "../../../pi/widget/widget";
import { notify } from "../../../pi/widget/event";


export class BottomTabBar extends Widget{
    constructor(){
        super();
    }
    public create(){
        super.create();
        this.init();
    }
    public init():void{
        this.state = {
            tabBarList:[{
                text:'钱包',
                icon:"u124.png",
                iconActive:"u250.png"
            },{
                text:'理财',
                icon:"u124.png",
                iconActive:"u250.png"
            },{
                text:'应用',
                icon:"u124.png",
                iconActive:"u250.png"
            },{
                text:'我的',
                icon:"u124.png",
                iconActive:"u250.png"
            }],
            isActive:0
        }
    }
    public tabBarChangeListener(event:any,index:number){
        if(this.state.isActive === index) return;
        this.state.isActive = index;
        notify(event.node,"ev-tab-change",{isActive:index});
        this.paint();
    }
}