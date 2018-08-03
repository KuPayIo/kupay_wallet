/**
 * send red-envelope to other
 */
import { ShareToPlatforms } from '../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';

interface Props {
    amount: number;
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
            webName:'挂号费',
            url:'https://www.baidu.com',
            title:'红包title',
            content:this.props.leaveMessage
        });
        this.ok && this.ok();
    }
}