import { Widget } from "../../pi/widget/widget";
export class App extends Widget{
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
                iconActive:"u250.png",
                components:"app-view-wallet-home"
            },{
                text:'理财',
                icon:"u124.png",
                iconActive:"u250.png",
                components:"app-view-financialManagement-home"
            },{
                text:'应用',
                icon:"u124.png",
                iconActive:"u250.png",
                components:"app-view-application-home"
            },{
                text:'我的',
                icon:"u124.png",
                iconActive:"u250.png",
                components:"app-view-mine-home"
            }],
            isActive:0
        }
    }
    public tabBarChangeListener(event:any,index:number){
        if(this.state.isActive === index) return;
        this.state.isActive = index;
        this.paint();
    }
}