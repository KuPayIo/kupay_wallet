/**
 * 购买记录详情
 */
// ===================================================导入
import { Widget } from '../../../../pi/widget/widget';
// =====================================================导出
export class RecordDetail extends Widget {
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
            yesterdayProfit:'0.002',
            totalProfit:'0.072',
            continuedDay:'3',
            annualIncome:'8%',
            productIntroduction:'ETH资管第1期是KuPay退出的一种固定收益类，回报稳定、无风险定期产品。',
            dealTime:'2018-8-1 12:12:03',
            unitPrice:'0.1',
            productName:'ETH资管第1期',
            amount:'2',
            lockday:'无'
        };
    }
    public goBackPage() {
        this.ok && this.ok();
    }

}