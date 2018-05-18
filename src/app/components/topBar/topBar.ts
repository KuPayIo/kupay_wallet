import { Widget } from "../../../pi/widget/widget";
import { notify } from "../../../pi/widget/event";

interface Props{
    title:string;
}
export class TopBar extends Widget{
    public props:Props;
    constructor(){
        super();
    }
    public backPrePage(event:any){
        notify(event.node,"ev-back-click",{})
    }
}