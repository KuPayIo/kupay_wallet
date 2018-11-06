/**
 * sendRedEnv
 */
import { ShareToPlatforms } from '../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { sharePerUrl } from '../../../net/pull';
import { LuckyMoneyType } from '../../../store/interface';
import { getStore } from '../../../store/memstore';
import { getLang } from '../../../../pi/util/lang';

interface Props {
    rid: string;
    rtype:string;  // '00' 等额红包  '01' 拼手气红包  '99' 邀请红包
    message: string;
}
export class SendRedEnv extends Widget {
    public props: Props;
    public language:any;
    public ok: () => void;

    public create() {
        super.create();
        this.language = this.config.value[getLang()];
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
            title = this.language.redEnvType[0]; 
        } else if (this.props.rtype === '01') {
            // tslint:disable-next-line:max-line-length
            url = `${sharePerUrl}?type=${LuckyMoneyType.Random}&rid=${this.props.rid}&lm=${(<any>window).encodeURIComponent(this.props.message)}&lan=${lan}`;
            title = this.language.redEnvType[1]; 
        } else {
            url = `${sharePerUrl}?cid=${this.props.rid}&type=${LuckyMoneyType.Invite}&lan=${lan}`;
            title = this.language.redEnvType[2];
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