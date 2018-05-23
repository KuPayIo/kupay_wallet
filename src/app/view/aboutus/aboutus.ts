import {Widget} from "../../../pi/widget/widget";
import { popNew } from "../../../pi/ui/root";

export class aboutus extends Widget{
    public ok: () => void;
    constructor(){
        super();
        this.state={
            data:[
                {value:"隐私条款",components:"app-view-aboutus-privacypolicy"},
                {value:"用户协议",components:"app-view-aboutus-useragreement"},
                {value:"版本更新",components:""}
            ]
        }
    }

    public itemClick(e,index){
        if(this.state.data[index].components!=""){
            popNew(this.state.data[index].components);
        }else{
            popNew("pi-components-message-message", { type: "success", content: "当前已是最新版本", center: true })
        }
    }

    public backPrePage(){
        this.ok && this.ok();
    }
}