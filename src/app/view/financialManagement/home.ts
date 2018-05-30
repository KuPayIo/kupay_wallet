import { Widget } from "../../../pi/widget/widget";
import { popNew } from "../../../pi/ui/root";
import { Swiper } from '../../res/js/swiper.min'

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
            bannerList:["banner1.png","banner2.png","banner3.png"],
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
            }],
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
            }],
            popularFunds:[{
                name:"社交通讯",
                number:"511109",
                per:37.98,
                MinInvestment:"100",
                date:"近一年"
            },{
                name:"物联网/DAG",
                number:"501229",
                per:12.18,
                MinInvestment:"10",
                date:"近一年"
            }]
        }
    }

    public attach(){
        super.attach();
        let mySwiper = new Swiper ('.swiper-container', {
            autoplay:{
                delay:2000,
                disableOnInteraction:false
            },
            pagination: {
                el: '.swiper-pagination',
                clickable:true,
                bulletClass : 'ga-pagination-bullet',
                bulletActiveClass: 'ga-pagination-bullet-active',
            },
        }) 
    }
    public fundClick(){
        
    }

    public balanceManagementClick(){
        popNew("app-view-financialManagement-balanceManagement-home");
    }
    public loanClick(){
        popNew("app-view-financialManagement-loan-home");
    }
    public preferredFundItemClick(e,index){
        popNew("app-view-financialManagement-fund-home",{fund:this.state.preferredFunds[index]});
    }
    public popularFundItemClick(e,index){
        popNew("app-view-financialManagement-fund-home",{fund:this.state.popularFunds[index]});
    }

}