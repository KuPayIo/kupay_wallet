/**
 * 带关闭按钮的提示模态框
 */
import { Widget } from '../../../pi/widget/widget';
interface Props {
    title:string;
    content:string;
    tips:string;
}
export class ModalBox1 extends Widget {
    public props:Props;
    public ok:() => void;
    public cancelClick() {
        this.ok && this.ok();
    }

}