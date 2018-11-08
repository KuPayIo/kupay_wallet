/**
 * modalbox
 */
import { Widget } from '../../../pi/widget/widget';
import { getLanguage } from '../../utils/tools';

interface Props {
    title: string;
    content: string;
    sureText?: string;
    cancelText?: string;
    style?: string; // 修改content的样式
}
export class ModalBox extends Widget {
    public props: Props;
    public ok: () => void;
    public cancel: () => void;

    public create() {
        super.create();
        this.state = {
            cfgData: getLanguage(this)
        };
    }
    public cancelBtnClick(e: any) {
        this.cancel && this.cancel();
    }
    public okBtnClick(e: any) {
        this.ok && this.ok();
    }
}