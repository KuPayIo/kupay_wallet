/**
 * open red-envelope
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';

export class OpenRedEnvelope extends Widget {
    public ok:() => void;
    public openRedEnvelopeClick() {
        popNew('app-components-message-message',{ itype:'success',content:'兑换成功',center:true });
        popNew('app-view-redEnvelope-receive-redEnvelopeDetails');
        this.ok && this.ok();
    }
}