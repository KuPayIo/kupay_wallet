/**
 * 提现界面
 */
import { Widget } from '../../../../pi/widget/widget';
export class Withdraw extends Widget {
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
            amount:0,// 提币金额
            serviceCharge:0.001,// 手续费
            cloudBalance:0.001,// 可提金额
            isFeeEnough:true
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
        const cloudBalance = this.state.cloudBalance;
        if ((amount + serviceCharge) > cloudBalance || cloudBalance === 0 || serviceCharge === cloudBalance) {
            this.state.isFeeEnough = false;
        } else {
            this.state.isFeeEnough = true;
        }
    }
}