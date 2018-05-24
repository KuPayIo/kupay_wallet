import {Widget} from "../../../pi/widget/widget";

export class messagefriends extends Widget{
    public ok: () => void;
    constructor(){
        super();
        this.state={  
            data:[
                {type:"1",content:"今天天气真好"},
                {type:"2",content:"对呀对呀！"},
                {type:"1",content:"转给你的两个以太坊收到了嘛？"},
                {type:"2",content:"收到了，好快呀",time:"5-23 10:53"},        
                {type:"1",content:"嗯，推荐大家都来用fairblock吧！"},
                {type:"2",content:"好呀好呀！"}
            ]     
        }
    }

    public create(){
        super.create();
        this.props = JSON.parse(window.sessionStorage.item);
    }

    public backPrePage(){
        this.ok && this.ok();
    }
   
}