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
    public init(){
        this.state = {
            chartsImgs:["p1.jpg","p3.jpg","p6.jpg","p12.jpg"],
            showChartsImg:"p1.jpg",
            historyPerformances:[{
                date:"近一月",
                change:"+2.75%"
            }]

        }
    }
    public backPrePage(){
        this.ok && this.ok();
    }

    public chartsSwitchClick(e,index){
        this.state.showChartsImg = this.state.chartsImgs[index];
        this.paint();
    }
}