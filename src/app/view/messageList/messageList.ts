import {Widget} from "../../../pi/widget/widget";
import {notify} from "../../../pi/widget/event";
import { popNew } from "../../../pi/ui/root";
import { Json } from "../../../pi/lang/type";

export class messageList extends Widget{
    public ok: (r) => void;
    constructor(){
        super();
        
    }

    public setProps(props: Json, oldProps?: Json){
        super.setProps(props,oldProps);
        this.state={
            data:[
                {type:"1",typename:"好友",title:"好呀好呀！", content:"1",time:"2018-5-23",noread:true&&this.props.hasNews,name:"小王"},
                {type:"2",typename:"公告",title:"发布通知", content:`fairblock发布内测版本，该版本实现了
                ·助记词导入钱包
                ·基于助记词和BIP44规范创建钱包
                ·支持钱包基本功能，包括：转账、收款、交易记录
                ·支持添加以太坊货币资产
                更多功能稍后退出`,time:"2018-05-27 17:24:00"},               
                {type:"3",typename:"交易通知",title:"交易完成", content:"",time:"2018-5-23"}
            ],
            clearPoint:false
           
        }
    }

    public goback(event:any){
        notify(event.node,"ev-back-click",{})
    }

    public backPrePage(){
        this.ok && this.ok(this.state.clearPoint);
    }

    public messDetail(event,index){
        if(this.state.data[index].noread){
            this.state.clearPoint = true;
            this.state.data[index].noread = false;
            this.paint();
        }
        window.sessionStorage.item = JSON.stringify(this.state.data[index]);
        
        if(this.state.data[index].type=="1"){
            popNew("app-view-messageList-messagefriends");
        }
        else if(this.state.data[index].type=="2"){
            popNew("app-view-messageList-messagenotice");
        }
        else{
            popNew("app-view-messageList-messagetrans");
        }
        
    }
}