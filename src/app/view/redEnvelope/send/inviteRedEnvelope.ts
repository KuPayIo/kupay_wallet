/**
 * invite red envelope
 */
import { ShareToPlatforms } from '../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';

interface Props {
    amount: number;
    leaveMessage: string;
    currencyName: string;
}
export class InviteRedEnvelope extends Widget {
    public ok: () => void;
    public props: Props;

    // 发送给好友
    public shareToFriends() {
        popNew('app-components-share-share', { text: this.props.leaveMessage, shareType: ShareToPlatforms.TYPE_IMG });
        this.ok && this.ok();
    }
    public backClick() {
        this.ok && this.ok();
    }
}