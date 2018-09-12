/**
 * open red-envelope
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { RedEnvelopeType } from '../../../store/interface';

interface Props {
    rtype:string;
    message: string;
    ctype: number;
    amount: number;
}
export class OpenRedEnvelope extends Widget {
    public ok:() => void;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        let tag = '';
        if (props.rtype === RedEnvelopeType.Normal) {
            tag = '您收到一个红包';
        } else if (props.rtype === RedEnvelopeType.Random) {
            tag = '金额随机，试试手气';
        } else if (props.rtype === RedEnvelopeType.Invite) {
            tag = '您收到一个邀请红包';
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
            
            popNew('app-components-message-message',{ content:'兑换成功' });
            this.backPrePage();
        },800);
       
    }

    public backPrePage() {
        this.ok && this.ok();
    }

}