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
            record:[{
                title:'ETH资管第1期',
                amount:'1',
                bonus:'0.002',
                days:'2'
            },{
                title:'ETH资管第1期',
                amount:'1',
                bonus:'0.002',
                days:'2'
            }],
            productList:[{
                title:'优选理财-随存随取',
                surplus:'20%',
                profit:'5%',
                productName:'ETH资管第1期',
                productDescribe:' 赎回T+0到账 | 0.1 ETH/份',
                isSoldOut:false
            },{
                title:'优选理财-随存随取',
                surplus:'50%',
                profit:'5%',
                productName:'ETH资管第1期',
                productDescribe:' 赎回T+0到账 | 0.1 ETH/份',
                isSoldOut:true
            }]
        };
    }
    public toDetail() {
        popNew('app-view-financialManagement-productDetail-productDetail');
    }
    public toRecord() {
        popNew('app-view-financialManagement-purchaseRecord-purchaseRecord');
    }
}