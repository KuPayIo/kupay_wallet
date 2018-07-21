/**
 * red-envelope record
 */
import { Widget } from '../../../pi/widget/widget';

export class RedEnvelopeRecord extends Widget {
    public ok:() => void;
    public backPrePage() {
        this.ok && this.ok();
    }
}