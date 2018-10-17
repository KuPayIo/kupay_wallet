/**
 * sendRedEnv
 */
import { ShareToPlatforms } from '../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { sharePerUrl } from '../../../net/pull';
import { RedEnvelopeType } from '../../../store/interface';
import { getLanguage } from '../../../utils/tools';

interface Props {
    rid: string;
    rtype:number;  // 0 等额红包  1 拼手气红包  99 邀请红包
    message: string;
}
export class SendRedEnv extends Widget {
    public props: Props;
    public ok: () => void;

    public create() {
        super.create();
        this.state = {
            cfgData:getLanguage(this)
        };
    }

    /**
     * 发红包
     */
    public sendRedEnv() {
        let url = '';
        let title = '';
        if (this.props.rtype === 0) {
            // tslint:disable-next-line:max-line-length
            url = `${sharePerUrl}?type=${RedEnvelopeType.Normal}&rid=${this.props.rid}&lm=${(<any>window).encodeURIComponent(this.props.message)}`;
            title = this.state.cfgData.redEnvType[0]; 
        } else if (this.props.rtype === 1) {
            // tslint:disable-next-line:max-line-length
            url = `${sharePerUrl}?type=${RedEnvelopeType.Random}&rid=${this.props.rid}&lm=${(<any>window).encodeURIComponent(this.props.message)}`;
            title = this.state.cfgData.redEnvType[1]; 
        } else {
            url = `${sharePerUrl}?cid=${this.props.rid}&type=${RedEnvelopeType.Invite}`;
            title = this.state.cfgData.redEnvType[2];
        }
        popNew('app-components-share-share', { 
            shareType: ShareToPlatforms.TYPE_LINK,
            url,
            title,
            content:this.props.message
        },() => {
            this.backPrePage();
        });
        console.error(url);
        // this.backPrePage();
    }

    public backPrePage() {
        this.ok && this.ok();
    }
}