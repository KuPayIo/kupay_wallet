/**
 * open red-envelope
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { requestLogined } from '../../../store/conMgr';

export class OpenRedEnvelope extends Widget {
    public ok:() => void;
    public create() {
        super.create();
        this.state = {
            openClick:false
        };
    }
    public openRedEnvelopeClick() {
        this.state.openClick = true;
        this.paint();
        // const res = await this.convertRedEnvelope();
        setTimeout(() => {
            popNew('app-components-message-message',{ itype:'success',content:'兑换成功',center:true });
            popNew('app-view-redEnvelope-receive-redEnvelopeDetails');
            this.ok && this.ok();
        },2000);
       
    }

    public async convertRedEnvelope() {
        const msg = {
            type:'convert_red_bag',
            param:{
                cid:this.state.redemptionCode
            }
        };
        const res = await requestLogined(msg);
        console.log('convertRedEnvelope',res);
    }
}