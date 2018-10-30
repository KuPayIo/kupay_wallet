/**
 * open red-envelope
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { LuckyMoneyType } from '../../../store/interface';
import { getLanguage } from '../../../utils/tools';

interface Props {
    rtype:string;
    message: string;
    ctypeShow: string;
    amount: number;
}
export class OpenRedEnvelope extends Widget {
    public ok:() => void;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        
        this.state = {
            tag:'',
            openClick:false,
            cfgData:getLanguage(this)
        };

        if (props.rtype === LuckyMoneyType.Normal) {
            this.state.tag = this.state.cfgData.tips[0];
        } else if (props.rtype === LuckyMoneyType.Random) {
            this.state.tag = this.state.cfgData.tips[1];
        } else if (props.rtype === LuckyMoneyType.Invite) {
            this.state.tag = this.state.cfgData.tips[2];
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
            
            popNew('app-components1-message-message',{ content:this.state.cfgData.successMess });
            this.backPrePage();
        },800);
       
    }

    public backPrePage() {
        this.ok && this.ok();
    }

}