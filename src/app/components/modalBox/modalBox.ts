/**
 * modalbox
 */
import { Widget } from '../../../pi/widget/widget';

interface Props {
    title:string;
    content:string;
    sureText:string;
    cancelText:string;
}
export class ModalBox extends Widget {
    public props: Props;
    public ok: () => void;
    public cancel: () => void;

    public create() {
        super.create();
        this.config = { value: { group: 'top' } };
    }
    public cancelBtnClick(e:any) {
        this.cancel && this.cancel();
    }
    public okBtnClick(e:any) {
        this.ok && this.ok();
    }
}