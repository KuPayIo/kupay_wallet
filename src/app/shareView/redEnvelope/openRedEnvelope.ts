/**
 * open red-envelope
 */
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';

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
        setTimeout(() => {
            popNew('app-shareView-redEnvelope-redEnvelopeDetails',{ code:'HGD78SDF' });
            this.ok && this.ok();
        },2000);
        
    }
}