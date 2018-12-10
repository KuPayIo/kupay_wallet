/**
 * modalbox
 */
import { Widget } from '../../../pi/widget/widget';

interface Props {
    title: string;
    content: string;
    sureText?: string;
    cancelText?: string;
    style?: string; // 修改content的样式
}
export class ModalBoxCheckBox extends Widget {
    public props: any;
    public ok: (deleteAccount:boolean) => void;
    public cancel: () => void;

    public setProps(props:any,oldProps:any) {
        super.setProps(props,oldProps);
        this.props = {
            ...this.props,
            deleteAccount:false
        };
    }
    public cancelBtnClick(e: any) {
        this.cancel && this.cancel();
    }
    public okBtnClick(e: any) {
        this.ok && this.ok(this.props.deleteAccount);
    }
    public deleteAccountClick() {
        this.props.deleteAccount = !this.props.deleteAccount;
        this.paint();
    }
}
