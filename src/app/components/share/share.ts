/**
 * fund share Page
 */
import { ShareToPlatforms } from '../../../pi/browser/shareToPlatforms';
import { Widget } from '../../../pi/widget/widget';

interface Props {
    text: string;
    shareType: number;
}

export class BaseShare extends Widget {
    public props: Props;
    public ok: () => void;
    public cancel: () => void;
    constructor() {
        super();
    }

    public setProps(props: Props, oldProps: Props): void {
        super.setProps(props, oldProps);
        this.state = {};
        if (this.props.shareType !== ShareToPlatforms.TYPE_TEXT) {
            this.state.isShowQQ = true;
            this.state.showCount = 4;
        } else {
            this.state.isShowQQ = false;
            this.state.showCount = 3;
        }

    }

    public backPrePage() {
        this.cancel && this.cancel();
    }

    public shareToWechat() {
        this.baseShare(ShareToPlatforms.PLATFORM_WEBCHAT);
    }

    public shareToFriends() {
        this.baseShare(ShareToPlatforms.PLATFORM_FRIENDS);
    }

    public shareToQQ() {
        this.baseShare(ShareToPlatforms.PLATFORM_QQ);
    }

    public shareToQQSpace() {
        this.baseShare(ShareToPlatforms.PLATFORM_QQSPACE);
    }

    private baseShare(platform: number) {
        const stp = new ShareToPlatforms();

        stp.init();
        stp.shareCode({
            success: (result) => {
                this.ok();
            },
            fail: (result) => {
                this.cancel();
            },
            content: this.props.text,
            type: this.props.shareType,
            platform: platform
        });
    }
} 