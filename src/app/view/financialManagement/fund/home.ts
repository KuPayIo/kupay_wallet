import { Widget } from "../../../../pi/widget/widget";
import { popNew } from "../../../../pi/ui/root";

export class FundHome extends Widget{
    public ok:()=>void
    constructor(){
        super();
    }
    public create(){
        super.create();
        this.init();
    }
    public attach(){
        
    }
    public init(){
        this.state = {
            chartsImgs:["p1.jpg","p3.jpg","p6.jpg","p12.jpg"],
            showChartsIndex:0,
            historyPerformances:[{
                date:"近一月",
                change:"+2.75%"
            },{
                date:"近三月",
                change:"+4.16%"
            },{
                date:"近半年",
                change:"+8.66%"
            },{
                date:"近一年",
                change:"+31.41%"
            },{
                date:"成立以来",
                change:"+30.53%"
            }],
            otherFundItem:["基金概况","基金公告","基金经理","基金公司","费率结构","基金问答"]

        }
    }
    public backPrePage(){
        this.ok && this.ok();
    }

    public chartsSwitchClick(e,index){
        this.state.showChartsIndex = index;
        this.paint();
    }
    public fundShareClick(){
        popNew("app-view-financialManagement-fund-share");
    }
}