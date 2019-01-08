/**
 * 去登录 modalbox
 */
import { Widget } from '../../../pi/widget/widget';

export class ModalBox extends Widget {
    public ok: () => void;
    public cancel: () => void;
    public props:any = { pi_norouter:true };

    public cancelBtnClick(e: any) {
        this.cancel && this.cancel();
    }
    public okBtnClick(e: any) {
        this.ok && this.ok();
    }
}