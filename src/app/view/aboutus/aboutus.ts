import {Widget} from "../../../pi/widget/widget";

export class aboutus extends Widget{
    constructor(){
        super();
        this.props={
            data:[
                {value:"隐私条款"},
                {value:"用户协议"},
                {value:"版本更新"}
            ]
        }
    }

}