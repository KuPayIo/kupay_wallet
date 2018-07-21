/**
 * convert red-envelope
 */
import { Widget } from '../../../pi/widget/widget';

export class ConvertRedEnvelope extends Widget {
    public ok:() => void;
    public backPrePage() {
        this.ok && this.ok();
    }
}