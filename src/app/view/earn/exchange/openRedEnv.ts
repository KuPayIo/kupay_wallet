/**
 * open red-envelope
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { RedEnvelopeType } from '../../../store/interface';
import { find } from '../../../store/store';

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
            cfgData:this.config.value.simpleChinese
        };
        const lan = find('languageSet');
        if (lan) {
            this.state.cfgData = this.config.value[lan.languageList[lan.selected]];
        }

        let tag = '';
        if (props.rtype === RedEnvelopeType.Normal) {
            tag = this.state.cfgData.tips[0];
        } else if (props.rtype === RedEnvelopeType.Random) {
            tag = this.state.cfgData.tips[1];
        } else if (props.rtype === RedEnvelopeType.Invite) {
            tag = this.state.cfgData.tips[2];
        }
        this.state = {
            tag,
            openClick:false
        };
    }

    /**
     * 开红包
     */
    public openRedEnv() {
        this.state.openClick = true;
        this.paint();
        setTimeout(() => {
            popNew('app-view-earn-exchange-exchangeDetail',this.props);
            
            popNew('app-components-message-message',{ content:this.state.cfgData.successMess });
            this.backPrePage();
        },800);
       
    }

    public backPrePage() {
        this.ok && this.ok();
    }

}