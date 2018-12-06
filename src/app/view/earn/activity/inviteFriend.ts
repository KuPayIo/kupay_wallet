/**
 * 活动-邀请好友
 */
import { ShareToPlatforms } from '../../../../pi/browser/shareToPlatforms';
import { getLang } from '../../../../pi/util/lang';
import { Widget } from '../../../../pi/widget/widget';
import { copyToClipboard, popNewMessage } from '../../../utils/tools';

interface Props {
    showPage:string;
}
export class InviteFriend extends Widget {
    public ok : () => void;
    public language:any;
    public props:any = {
        showPage:'first',
        inviteCode:'GY3D8S'
    };
    public create() {
        super.create();
        this.init();
    }

    public init() {
        this.language = this.config.value[getLang()];
    }
    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
    /**
     * 切换显示页面
     * @param page 显示页面标识
     */
    public change(page:string) {
        this.props.showPage = page;
        this.paint();
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

    public copyClick() {
        copyToClipboard(this.props.inviteCode);
        popNewMessage(this.language.tips[0]);
    }
    
    private baseShare(platform: number) {
        const stp = new ShareToPlatforms();

        stp.init();

    }

}