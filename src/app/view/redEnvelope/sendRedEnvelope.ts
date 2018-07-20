/**
 * send red-envelope
 */
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';

export class SendRedEnvelope extends Widget {
    public ok:() => void;
    public create() {
        super.create();
        this.init();
    }

    public init() {
        this.state = {
            balance:55.55,
            amount:0
        };
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    public amountInputChange(e:any) {
        const amount = Number(e.value);
        this.state.amount = amount;
        this.paint();
    }

    // 发送
    public sendRedEnvelopeClick() {
        console.log('sendRedEnvelopeClick');
        popNew('app-view-redEnvelope-shareRedEnvelope');
    }
    
    // 红包记录
    public redEnvelopeRecordsClick() {
        console.log('redEnvelopeRecordsClick');
        popNew('app-view-redEnvelope-redEnvelopeRecord');
        
    }
}