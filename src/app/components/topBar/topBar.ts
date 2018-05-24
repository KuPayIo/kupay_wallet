import { Widget } from "../../../pi/widget/widget";
import { notify } from "../../../pi/widget/event";

interface Props{
    title:string;
    style?:string;
    iconColor?:string;
}
export class TopBar extends Widget{
    public props:Props;
    constructor(){
        super();
    }
    public create(){
        super.create();
        this.init();
    }
    public init(){
        this.state = {
            backIcon:{
                "default":"btn_back.png",
                "white":"btn_back_white.png"
            }
        }
    }
    public backPrePage(event:any){
        notify(event.node,"ev-back-click",{})
    }
}