/**
 * 活动-邀请好友
 */
import { ShareToPlatforms } from '../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Widget } from '../../../../pi/widget/widget';
import { makeScreenShot } from '../../../logic/native';
import { getInviteCode } from '../../../net/pull';
import { copyToClipboard, popNewMessage } from '../../../utils/tools';

interface Props {
    showPage:string;
    inviteCode:string;
}
export class InviteFriend extends Widget {
    public ok : () => void;
    public language:any;
    public props:Props = {
        showPage:'first',
        inviteCode:'******'
    };
    public create() {
        super.create();
        this.initData();
    }

    public async initData() {
        this.language = this.config.value[getLang()];
        const inviteCodeInfo = await getInviteCode();
        if (inviteCodeInfo.result !== 1) return;
        this.props.inviteCode = inviteCodeInfo.cid;
        this.paint();
    }
    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
    public refreshPage() {
        this.initData();
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
        makeScreenShot(() => {
            stp.shareScreenShot({
                success: (result) => {  },
                fail: (result) => {  },
                platform: platform
            });
        },() => {
            // popNew('app-components-message-message',{ content:this.language.tips[0] });
        });

    }

}