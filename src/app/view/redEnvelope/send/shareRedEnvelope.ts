/**
 * send red-envelope to other
 */
import { ShareToPlatforms } from '../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';

interface Props {
    rid: string;
    leaveMessage: string;
    currencyName: string;
}
export class ShareRedEnvelope extends Widget {
    public ok: () => void;
    public props: Props;

    // 发送给好友
    public shareToFriends() {
        popNew('app-components-share-share', { 
            shareType: ShareToPlatforms.TYPE_LINK,
            url:`http://120.24.44.254:8080/wallet/app/boot/share.html?rid=${this.props.rid}`,
            title:'等额红包',
            content:this.props.leaveMessage
        });
        this.ok && this.ok();
    }
}