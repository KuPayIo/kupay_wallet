/**
 * 消息框
 */
import { Widget } from '../../../pi/widget/widget';

export class OpenLink extends Widget {
    public ok: () => void;
    public cancel:() => void;

    public openClick() {
        this.ok && this.ok();
    }

    public cancelClick() {
        this.cancel && this.cancel();
    }
   
}
