/**
 * fund share Page
 */
import { ShareToPlatforms } from '../../../pi/browser/shareToPlatforms';
import { Widget } from '../../../pi/widget/widget';

interface Props {
    text: string;
    shareType: number;
    webName: string;
    url: string;
    title: string;
    content: string;
    comment: string;
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
        this.baseShare(ShareToPlatforms.PLATFORM_MOMENTS);
    }

    public shareToQQ() {
        this.baseShare(ShareToPlatforms.PLATFORM_QQ);
    }

    public shareToQQSpace() {
        this.baseShare(ShareToPlatforms.PLATFORM_QZONE);
    }

    private baseShare(platform: number) {
        const stp = new ShareToPlatforms();

        stp.init();
        if (this.props.shareType === ShareToPlatforms.TYPE_LINK) {
            stp.shareLink({
                success: (result) => { this.ok(); },
                fail: (result) => { this.cancel(); },
                webName: this.props.webName || '钱包',
                url: this.props.url,
                title: this.props.title,
                content: this.props.content,
                comment: this.props.comment || ''
            });
        } else {
            stp.shareCode({
                success: (result) => { this.ok(); },
                fail: (result) => { this.cancel(); },
                content: this.props.text,
                type: this.props.shareType,
                platform: platform
            });
        }

    }
} 