/**
 * GT 充值页面
 */
import { Widget } from '../../../../pi/widget/widget';

interface Props {
    payType:PayType;
}

enum PayType {
    wxPay = 1,
    aliPay = 2

}
export class RechargeGT extends Widget {
    public ok:() => void; 
    public props:Props = {
        payType : 1
    };
    constructor() {
        super();
    }
    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }

    public changPay(payType:number) {
        this.props.payType = payType;
        this.paint();
    }
}