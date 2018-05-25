import {Widget} from "../../../pi/widget/widget";
import {notify} from "../../../pi/widget/event";
import { popNew } from "../../../pi/ui/root";

export class messageList extends Widget{
    public ok: () => void;
    constructor(){
        super();
        this.props={
            data:[
                {type:"1",typename:"好友",title:"好呀好呀！", content:"",time:"2018-5-23",noread:true,name:"小王"},
                {type:"2",typename:"公告",title:"发布通知", content:"这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容",time:"2018-5-23",noread:true},               
                {type:"3",typename:"交易通知",title:"交易完成", content:"",time:"2018-5-23"},
                {type:"1",typename:"好友",title:"最近行情如何？", content:"",time:"2018-5-23",name:"小何"},
                {type:"2",typename:"公告",title:"发布通知", content:"这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容",time:"2018-5-23"}                                               
            ]
        }
    }

    public goback(event:any){
        notify(event.node,"ev-back-click",{})
    }

    public backPrePage(){
        this.ok && this.ok();
    }

    public messDetail(event,index){
        window.sessionStorage.item = JSON.stringify(this.props.data[index]);
        if(this.props.data[index].type=="1"){
            popNew("app-view-messageList-messagefriends");
        }
        else if(this.props.data[index].type=="2"){
            popNew("app-view-messageList-messagenotice");
        }
        else{
            popNew("app-view-messageList-messagetrans");
        }
        
    }
}