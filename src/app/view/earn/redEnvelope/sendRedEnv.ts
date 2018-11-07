/**
 * sendRedEnv
 */
import { ShareToPlatforms } from '../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { sharePerUrl } from '../../../net/pull';
import { LuckyMoneyType } from '../../../store/interface';
import { getStore } from '../../../store/memstore';
import { getLanguage } from '../../../utils/tools';

interface Props {
    rid: string;
    rtype:string;  // '00' 等额红包  '01' 拼手气红包  '99' 邀请红包
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
        const lan = getStore('setting/language','zh_Hans');
        
        if (this.props.rtype === '00') {
            // tslint:disable-next-line:max-line-length
            url = `${sharePerUrl}?type=${LuckyMoneyType.Normal}&rid=${this.props.rid}&lm=${(<any>window).encodeURIComponent(this.props.message)}&lan=${lan}`;
            title = this.state.cfgData.redEnvType[0]; 
        } else if (this.props.rtype === '01') {
            // tslint:disable-next-line:max-line-length
            url = `${sharePerUrl}?type=${LuckyMoneyType.Random}&rid=${this.props.rid}&lm=${(<any>window).encodeURIComponent(this.props.message)}&lan=${lan}`;
            title = this.state.cfgData.redEnvType[1]; 
        } else {
            url = `${sharePerUrl}?cid=${this.props.rid}&type=${LuckyMoneyType.Invite}&lan=${lan}`;
            title = this.state.cfgData.redEnvType[2];
        }
        popNew('app-components-share-share', { 
            shareType: ShareToPlatforms.TYPE_LINK,
            url,
            title,
            content:this.props.message
        },() => {
            this.backPrePage();
        },() => {
            this.backPrePage();
        });
        console.error(url);
    }

    public backPrePage() {
        this.ok && this.ok();
    }
}