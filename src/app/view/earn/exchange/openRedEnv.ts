/**
 * open red-envelope
 */
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { LuckyMoneyType } from '../../../store/interface';
// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface Props {
    rtype:string;
    message: string;
    ctypeShow: string;
    amount: number;
}
export class OpenRedEnvelope extends Widget {
    public ok:() => void;
    public language:any;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.language = this.config.value[getLang()];
        this.state = {
            tag:'',
            openClick:false
        };

        if (props.rtype === LuckyMoneyType.Normal) {
            this.state.tag = this.language.tips[0];
        } else if (props.rtype === LuckyMoneyType.Random) {
            this.state.tag = this.language.tips[1];
        } else if (props.rtype === LuckyMoneyType.Invite) {
            this.state.tag = this.language.tips[2];
        }
        
    }

    /**
     * 开红包
     */
    public openRedEnv() {
        this.state.openClick = true;
        
        this.paint();
        setTimeout(() => {
            popNew('app-view-earn-exchange-exchangeDetail',this.props);
            
            popNew('app-components1-message-message',{ content:this.language.successMess });
            this.backPrePage();
        },800);
       
    }

    public backPrePage() {
        this.ok && this.ok();
    }

}
