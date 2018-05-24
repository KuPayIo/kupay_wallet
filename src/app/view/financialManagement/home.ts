import { Widget } from "../../../pi/widget/widget";
import { popNew } from "../../../pi/ui/root";

export class FinancialManagementHome extends Widget{
    constructor(){
        super();
    }
    public create(){
        super.create();
        this.init();
    }
    public init(){
        this.state = {
            newsList:[{
                title:"2018巴菲特股东大会，说了些什么？",
                time:'2小时前'
            },{
                title:"现在的年轻人消费已经开始降级了",
                time:'3小时前'
            },{
                title:"以太坊Casper FFG发布v0.1.0代码",
                time:'5小时前'
            },{
                title:"区块链加物联网等于空气",
                time:'5小时前'
            }]
        }
    }

    public fundClick(){
        popNew("app-view-financialManagement-fund-home");
    }

    public balanceManagementClick(){
        popNew("app-view-financialManagement-balanceManagement-home");
    }
    public loanClick(){
        popNew("app-view-financialManagement-loan-home");
    }
}