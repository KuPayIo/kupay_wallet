/**
 * 充值页面
 */
import { Widget } from '../../../../pi/widget/widget';
export class Charge extends Widget {
    public ok:() => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init(): void {
        this.state = {
            amount:0,// 充值输入值
            serviceCharge:0.001,// 手续费
            localBalance:0.00,// 本地余额
            isFeeEnough:false
        };
        this.judgeFeeEnough();
    }
    public backClick() {
        this.ok && this.ok();
    }
    public amountInput(e:any) {
        this.state.amount = Number(e.currentTarget.value);
        this.judgeFeeEnough();
        this.paint();
    }
    public serviceChargeInput(e:any) {
        this.state.serviceCharge = Number(e.currentTarget.value);
        this.judgeFeeEnough();
        this.paint();
    }
    public judgeFeeEnough() {
        const amount = this.state.amount;
        const serviceCharge = this.state.serviceCharge;
        const localBalance = this.state.localBalance;
        if ((amount + serviceCharge) > localBalance || localBalance === 0 || serviceCharge === localBalance) {
            this.state.isFeeEnough = false;
        } else {
            this.state.isFeeEnough = true;
        }
    }
}