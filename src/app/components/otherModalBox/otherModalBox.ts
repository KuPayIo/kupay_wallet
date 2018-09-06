/**
 * modalbox
 */
import { Widget } from '../../../pi/widget/widget';

interface Props {
    title:string;
    content:string;
    tips:string;
}
export class ModalBox extends Widget {
    public props: Props;
    public ok: () => void;
    public cancel: () => void;

    public create() {
        super.create();
        this.config = { value: { group: 'top' } };
    }

    public cancelBtn(){
        this.ok && this.ok();
    }
}