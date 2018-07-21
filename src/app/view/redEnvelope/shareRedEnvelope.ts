/**
 * send red-envelope to other
 */
import { Widget } from '../../../pi/widget/widget';

export class ShareRedEnvelope extends Widget {
    public ok:() => void;
    // 发送给好友
    public shareToFriends() {
        console.log('shareToFriends');
        this.ok && this.ok();
    }
}