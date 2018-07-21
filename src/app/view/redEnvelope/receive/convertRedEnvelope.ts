/**
 * convert red-envelope
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { RedEnvelope } from '../../interface';

export class ConvertRedEnvelope extends Widget {
    public ok:() => void;
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            redemptionCode:'',
            redEnvelope:{
                type:'等额红包',
                time:'04-12  14:32:00',
                currencyName:'ETH',
                amount:1,
                leaveMessage:'恭喜发财,大吉大利'
            },
            placeHolder:'输入兑换码，领取红包',
            style:{
                backgroundColor: '#F8F8F8',
                border: '1px solid #D6D9DF',
                borderRadius: '6px',
                padding:'0 17px'
            }
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }

    public redemptionCodeChange(e:any) {
        this.state.redemptionCode = e.value;
    }
    // 兑换
    public convertClick() {
        if (this.state.redemptionCode.trim().length <= 0) {
            popNew('app-components-message-message',{ itype:'error',content:'请输入兑换码',center:true });

            return;
        }
        // tslint:disable-next-line:max-line-length
        popNew('app-view-redEnvelope-receive-openRedEnvelope',{ redemptionCode:this.state.redemptionCode,redEnvelope:this.state.redEnvelope });
    }
}