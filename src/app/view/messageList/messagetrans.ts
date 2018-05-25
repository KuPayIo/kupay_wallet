import {Widget} from "../../../pi/widget/widget";

export class messagetrans extends Widget{
    public ok: () => void;
    constructor(){
        super();
        this.state={  
            data:[
                {type:"1",content:"0.001",unit:"BTC"},
                {type:"2",content:"0.001",unit:"ETH"},
                {type:"1",content:"0.001",unit:"ETH"},
                {type:"2",content:"0.001",unit:"GAIA"}
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