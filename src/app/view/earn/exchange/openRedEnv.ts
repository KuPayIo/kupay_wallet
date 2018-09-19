/**
 * open red-envelope
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { RedEnvelopeType } from '../../../store/interface';

interface Props {
    rtype:string;
    message: string;
    ctypeShow: string;
    amount: number;
}
export class OpenRedEnvelope extends Widget {
    public ok:() => void;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        let tag = '';
        if (props.rtype === RedEnvelopeType.Normal) {
            tag = this.config.value.tips[0];
        } else if (props.rtype === RedEnvelopeType.Random) {
            tag = this.config.value.tips[1];
        } else if (props.rtype === RedEnvelopeType.Invite) {
            tag = this.config.value.tips[2];
        }
        this.state = {
            tag,
            openClick:false
        };
    }

    /**
     * 开红包
     */
    public openRedEnv() {
        this.state.openClick = true;
        this.paint();
        setTimeout(() => {
            popNew('app-view-earn-exchange-exchangeDetail',this.props);
            
            popNew('app-components-message-message',{ content:this.config.value.successMess });
            this.backPrePage();
        },800);
       
    }

    public backPrePage() {
        this.ok && this.ok();
    }

}