/**
 * sendRedEnv
 */
import { ShareToPlatforms } from '../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { sharePerUrl } from '../../../net/pull';
import { RedEnvelopeType } from '../../../store/interface';

interface Props {
    rid: string;
    rtype:number;  // 0 等额红包  1 拼手气红包
    message: string;
    cname: string;
}
export class SendRedEnv extends Widget {
    public props: Props;
    public ok: () => void;

    /**
     * 发红包
     */
    public sendRedEnv() {
        let url = '';
        let title = '';
        if (this.props.rtype === 0) {
            // tslint:disable-next-line:max-line-length
            url = `${sharePerUrl}?type=${RedEnvelopeType.Normal}&rid=${this.props.rid}&lm=${(<any>window).encodeURIComponent(this.props.message)}`;
            title = '等额红包'; 
        } else {
            // tslint:disable-next-line:max-line-length
            url = `${sharePerUrl}?type=${RedEnvelopeType.Random}&rid=${this.props.rid}&lm=${(<any>window).encodeURIComponent(this.props.message)}`;
            title = '拼手气红包'; 
        }
        popNew('app-components-share-share', { 
            shareType: ShareToPlatforms.TYPE_LINK,
            url,
            title,
            content:this.props.message
        });
        // this.backPrePage();
    }

    public backPrePage() {
        this.ok && this.ok();
    }
}