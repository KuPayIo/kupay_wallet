/**
 * fund share Page
 */
import { SharePlatform,ShareToPlatforms,ShareType } from '../../../pi/browser/shareToPlatforms';
import { Widget } from '../../../pi/widget/widget';

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
    public props: any;
    public ok: (success:boolean) => void;
    public cancel: (success:boolean) => void;

    public setProps(props: Props, oldProps: Props): void {
        super.setProps(props, oldProps);
        if (this.props.shareType !== ShareType.TYPE_TEXT) {
            this.props.isShowQQ = true;
            this.props.showCount = 4;
        } else {
            this.props.isShowQQ = false;
            this.props.showCount = 3;
        }

    }

    public backPrePage() {
        this.cancel && this.cancel(false);
    }

    public shareToWechat() {
        this.baseShare(SharePlatform.PLATFORM_WEBCHAT);
    }

    public shareToFriends() {
        this.baseShare(SharePlatform.PLATFORM_MOMENTS);
    }

    public shareToQQ() {
        this.baseShare(SharePlatform.PLATFORM_QQ);
    }

    public shareToQQSpace() {
        this.baseShare(SharePlatform.PLATFORM_QZONE);
    }

    private baseShare(platform: number) {
        if (this.props.shareType === ShareType.TYPE_LINK) {
            const walletName = '钱包';

            ShareToPlatforms.shareLink({
                success: (result) => { console.log('share success callback');this.ok(true); },
                fail: (result) => { console.log('share fail callback');this.cancel(false); },
                webName: this.props.webName || walletName,
                url: this.props.url,
                title: this.props.title,
                content: this.props.content,
                comment: this.props.comment || '',
                platform: platform
            });
        } else if (this.props.shareType === ShareType.TYPE_SCREEN) {
            ShareToPlatforms.shareScreenShot({
                success: (result) => { console.log('share success callback');this.ok(true); },
                fail: (result) => { console.log('share fail callback');this.cancel(false); },
                platform: platform
            });
        } else {
            console.log('share text====',this.props.text);
            console.log('share type====',this.props.shareType);
            ShareToPlatforms.shareCode({
                success: (result) => { 
                    console.log('share success callback');
                    this.ok(true); 
                },
                fail: (result) => { console.log('share fail callback');this.cancel(false); },
                content: this.props.text,
                type: this.props.shareType,
                platform: platform
            });
        }

    }
} 