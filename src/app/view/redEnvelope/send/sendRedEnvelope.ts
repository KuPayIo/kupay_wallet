/**
 * send red-envelope
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { getByteLen } from '../../../utils/tools';

export class SendRedEnvelope extends Widget {
    public ok:() => void;
    public create() {
        super.create();
        this.init();
    }

    public init() {
        this.state = {
            balance:55.55,
            currencyName:'ETH',
            amount:0,
            leaveMessage:'恭喜发财,大吉大利',
            leaveMessageMaxLen:20
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
    public leaveMessageChange(e:any) {
        this.state.leaveMessage = e.value;
    }

    // 发送
    public sendRedEnvelopeClick() {
        if (this.state.amount <= 0) {
            popNew('app-components-message-message',{ itype:'error',content:'请输入要发送的金额',center:true });

            return;
        }
        if (getByteLen(this.state.leaveMessage) > this.state.leaveMessageMaxLen * 2) {
            popNew('app-components-message-message',{ itype:'error',content:`留言最多${this.state.leaveMessageMaxLen}个字`,center:true });
            this.state.leaveMessage = '';
            this.paint();

            return;
        }
        popNew('app-view-redEnvelope-send-shareRedEnvelope',{
            amount:this.state.amount,
            leaveMessage:this.state.leaveMessage,
            currencyName:this.state.currencyName
        });
    }
    
    // 红包记录
    public redEnvelopeRecordsClick() {
        console.log('redEnvelopeRecordsClick');
        popNew('app-view-redEnvelope-send-redEnvelopeRecord');
        
    }
}