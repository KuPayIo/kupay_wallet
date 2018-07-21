/**
 * red-envelope details
 */
import { Widget } from '../../../pi/widget/widget';

export class RedEnvelopeDetails extends Widget {
    public ok:() => void;
    public backPrePage() {
        this.ok && this.ok();
    }
}