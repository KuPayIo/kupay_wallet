/**
 * invite red envelope
 */
import { ShareToPlatforms } from '../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { RedEnvelopeType, sharePerUrl } from '../../../store/conMgr';

interface Props {
    inviteCode: string;
    inviteCodeDetailInfo: string;
}

export class InviteRedEnvelope extends Widget {
    public ok: () => void;

    public setProps(props: Props, oldProps: Props): void {
        super.setProps(props, oldProps);
        this.init();
    }

    // 发送给好友
    public shareToFriends() {
        popNew('app-components-share-share', {
            shareType: ShareToPlatforms.TYPE_LINK,
            url: `${sharePerUrl}?cid=${this.props.inviteCode}&type=${RedEnvelopeType.Invite}`,
            title: '邀请红包',
            content: this.state.shareContent
        });
    }
    public backClick() {
        this.ok && this.ok();
    }

    // 初始化
    private init() {
        this.state = {
            allCurrency: '0.5 ETH',
            eachCurrency: '0.015 ETH',
            eachInviteCurrency1: '500 KT',
            eachInviteCurrency2: '0.01 ETH',
            inviteOkCount: 0,
            inviteAllCount: 20,
            inviteCurrency1: '0 KT',
            inviteCurrency2: '0 ETH',
            inviteLimitCurrency: '1000 KT',
            lastTime: '9月10日',
            shareContent: '我是邀请红包'
        };
        console.log(this.props.inviteCode, this.props.inviteCodeDetailInfo);
        this.state.inviteOkCount = this.props.inviteCodeDetailInfo[0];
        if (this.props.inviteCodeDetailInfo[1].length > 0) {
            let currency1 = 0;
            let currency2 = 0;
            this.props.inviteCodeDetailInfo[1].forEach(v => {
                currency1 += v[0];
                currency2 += v[1];
            });
            this.state.inviteCurrency1 = `${currency1} KT`;
            this.state.inviteCurrency2 = `${currency2} ETH`;
        }
    }
}