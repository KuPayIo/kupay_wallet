/**
 * 理财产品详情页面
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
export class ProductDetail extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public setProps(props: any, oldProps: any) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init() {
        this.state = {
            isSellOut:false,
            expectedAnnualIncome:'+8.0000%',// 预期年化收益
            subscriptionPeriod:'30天',// 认购期限
            purchaseAmount:1000,// 起购金额
            purchaseDay:'今天',// 申购日
            dayOfInterest:'2018-8-16',// 起息日
            dueDate:'2018-8-30',// 到期日
            surplusAmount:'0MPT',
            productDetail:{
                subscribeCurrency:'MPT',// 认购币种
                paymentMethod:'预期年化收益',// 收款方式
                productLine:'100000MPT',// 产品额度
                limit:'1000MPT起购，每人认购无上限',// 额度限制
                timeLimit:'即日起到8月16日23：59：59或购完即止'// 时间限制
            },
            // 产品描述
            productIntroduction:`KuPay${this.props.id}号理财产品是KuPay面向KuPay用户与资产端撮合的固定周期理财
            项目，为KuPay用户提供资产理财和到期自动退出服务。KuPay通过优选资产穿透体系，为用户提供多样低风险优质理财产品。`
        }; 
    }
    public goBackPage() {
        this.ok && this.ok();
    }
    public buyClicked() {
        popNew('app-view-financialManagement-purchase-purchase',{ id:this.props.id });
        this.ok && this.ok();
    }
}