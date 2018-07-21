/**
 * send red-envelope to other
 */
import { Widget } from '../../../../pi/widget/widget';
import { shareToQrcode } from '../../../utils/tools';

interface Props {
    amount:number;
    leaveMessage:string;
    currencyName:string;
}
export class ShareRedEnvelope extends Widget {
    public ok:() => void;

    // 发送给好友
    public shareToFriends() {
        const props:Props = this.props;
        shareToQrcode(props.leaveMessage);
        this.ok && this.ok();
    }
}