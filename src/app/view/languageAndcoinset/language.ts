import {Widget} from "../../../pi/widget/widget";
import {notify} from "../../../pi/widget/event";

export class language extends Widget{
    constructor(){
        super();
        this.props={
            checkedIndex:0,
            data:[
                {index:0,lan:"中文",checked:true},
                {index:1,lan:"English"}
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
}