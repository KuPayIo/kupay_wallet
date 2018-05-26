import {Widget} from "../../../../pi/widget/widget";
import {notify} from "../../../../pi/widget/event";

export class language extends Widget{
    public ok: () => void;
    constructor(){
        super();
        this.props={
            checkedIndex:0,
            data:[
                {index:0,lan:"中文",checked:true},
                {index:1,lan:"英文"}
            ]
        }
    }

    public radioChangeListener(event:any){ 
        for(let i in this.props.data){
            if(event.index!=this.props.data[i].index){
                this.props.data[i].checked = false;
            }
        }
        this.paint();       
    }   

    public backPrePage(){
        this.ok && this.ok();
    }
}