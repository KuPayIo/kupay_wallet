/**
 * open red-envelope
 */
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';

export class OpenRedEnvelope extends Widget {
    public ok:() => void;
    public openRedEnvelopeClick() {
        
        setTimeout(() => {
            popNew('app-shareView-redEnvelope-redEnvelopeDetails',{ code:'HGD78SDF' });
            this.ok && this.ok();
        },2000);
        
    }
}