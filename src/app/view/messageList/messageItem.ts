import {Widget} from "../../../pi/widget/widget";
import {notify} from "../../../pi/widget/event";
import { popNew } from "../../../pi/ui/root";

export class messageList extends Widget{
    public ok: () => void;
    constructor(){
        super();
        this.props={       
            type:"公告",
            title:"标题标题标题标题标题标题标题标题标题标题",
            content:"这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容",
            time:"4-5"
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