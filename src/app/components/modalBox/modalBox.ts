/**
 * modalbox
 */
import { Widget } from '../../../pi/widget/widget';

interface Props {
    title: string;
    content: string;
    onlyOk:boolean;
    sureText?: string;
    cancelText?: string;
    style?: string; // 修改content的样式
}
export class ModalBox extends Widget {
    public props: any;
    public ok: () => void;
    public cancel: () => void;

    public setProps(props:Props,oldProps:Props) {
        this.props = {
            ...props,
            pi_norouter:true
        };
        super.setProps(this.props,oldProps);
    }
    public cancelBtnClick(e: any) {
        this.cancel && this.cancel();
    }
    public okBtnClick(e: any) {
        this.ok && this.ok();
    }
}