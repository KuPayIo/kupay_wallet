/**
 * fund share Page
 */
import { ShareToPlatforms } from '../../../pi/browser/shareToPlatforms';
import { Widget } from '../../../pi/widget/widget';
import { getLang } from '../../../pi/util/lang';

interface Props {
    text?: string;
    shareType: number;
    webName?: string;
    url?: string;
    title?: string;
    content?: string;
    comment?: string;
}

export class BaseShare extends Widget {
    public props: Props;
    public ok: (success:boolean) => void;
    public cancel: (success:boolean) => void;

    public language:any;
    public setProps(props: Props, oldProps: Props): void {
        super.setProps(props, oldProps);
        this.language = this.config.value[getLang()];
        this.state ={};
        if (this.props.shareType !== ShareToPlatforms.TYPE_TEXT) {
            this.state.isShowQQ = true;
            this.state.showCount = 4;
        } else {
            this.state.isShowQQ = false;
            this.state.showCount = 3;
        }

    }

    public backPrePage() {
        this.cancel && this.cancel(false);
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
                success: (result) => { this.ok(true); },
                fail: (result) => { this.cancel(false); },
                webName: this.props.webName || this.language.wallet,
                url: this.props.url,
                title: this.props.title,
                content: this.props.content,
                comment: this.props.comment || '',
                platform: platform
            });
        } else if (this.props.shareType === ShareToPlatforms.TYPE_SCREEN) {
            stp.shareScreenShot({
                success: (result) => { this.ok(true); },
                fail: (result) => { this.cancel(false); },
                platform: platform
            });
        } else {
            console.log('share text====',this.props.text);
            console.log('share type====',this.props.shareType);
            stp.shareCode({
                success: (result) => { this.ok(true); },
                fail: (result) => { this.cancel(false); },
                content: this.props.text,
                type: this.props.shareType,
                platform: platform
            });
        }

    }
} 