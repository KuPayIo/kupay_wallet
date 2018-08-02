/**
 * 理财产品首页
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
export class Index extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            assets: 0,// 持有资产
            cumulativeIncome: 0,// 累计收益
            productList:[{
                id:'1',
                expectedEarnings:'+8.0000%',
                title:'币生币MPT增币',
                tip:'预期年化收益',
                content:'新人专享收益稳，1000MPT起投，历史从未亏损',
                isSellOut:true
            },{
                id:'2',
                expectedEarnings:'+10.0000%',
                title:'币生币MPT增币',
                tip:'预期年化收益',
                content:'新人专享收益稳，1000MPT起投，历史从未亏损',
                isSellOut:true
            }]
            
        };  
    }
    public toDetail(e:any,id:any) {
        popNew('app-view-financialManagement-productDetail-productDetail',{ id });
    }

    public assestsClicked() {
        popNew('app-view-financialManagement-index-possessionAssets');
    }
    public incomeClicked() {
        popNew('app-view-financialManagement-index-cumulativeIncome');
    }
}