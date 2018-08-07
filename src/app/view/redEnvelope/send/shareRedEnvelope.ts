/**
 * send red-envelope to other
 */
import { ShareToPlatforms } from '../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { RedEnvelopeType, sharePerUrl } from '../../../store/conMgr';

interface Props {
    rid: string;
    rtype:number;
    leaveMessage: string;
    currencyName: string;
}
export class ShareRedEnvelope extends Widget {
    public ok: () => void;
    public props: Props;

    // 发送给好友
    public shareToFriends() {
        let url = '';
        let title = '';
        if (this.props.rtype === 0) {
            // tslint:disable-next-line:max-line-length
            url = `${sharePerUrl}?type=${RedEnvelopeType.Normal}&rid=${this.props.rid}&lm=${(<any>window).encodeURIComponent(this.props.leaveMessage)}`;
            title = '等额红包'; 
        } else {
            // tslint:disable-next-line:max-line-length
            url = `${sharePerUrl}?type=${RedEnvelopeType.Random}&rid=${this.props.rid}&lm=${(<any>window).encodeURIComponent(this.props.leaveMessage)}`;
            title = '拼手气红包'; 
        }
        popNew('app-components-share-share', { 
            shareType: ShareToPlatforms.TYPE_LINK,
            url,
            title,
            content:this.props.leaveMessage
        });
        this.ok && this.ok();
    }
}