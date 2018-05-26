import { Widget } from "../../../../pi/widget/widget";
import { popNew } from "../../../../pi/ui/root";

export class BalanceManagementHome extends Widget{
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
            preferredFunds:[{
                name:"生物/医疗健康",
                number:"501009",
                per:27.24,
                MinInvestment:"1,000",
                date:"近一年"
            },{
                name:"基础链",
                number:"501019",
                per:25.76,
                MinInvestment:"10",
                date:"近一年"
            }]
        }
    }
    public goBackClick(){
        this.ok && this.ok();
    }

    public preferredFundItemClick(e,index){
        popNew("app-view-financialManagement-fund-home",{fund:this.state.preferredFunds[index]});
    }

    public projectIntroductionClick(){
        popNew("app-components-message-message", { type: "notice", content: "正在开发,敬请期待" });
    }

    public commonProblemClick(){
        popNew("app-components-message-message", { type: "notice", content: "正在开发,敬请期待" });
    }
}