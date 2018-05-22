import {Widget} from "../../../pi/widget/widget";

interface Props {
    data:any[];
}

export class listItem extends Widget{
    public props : Props;
    constructor(){
        super();
    }

    public goNext(event:any){
        console.log("hhhhhh");
    }
}