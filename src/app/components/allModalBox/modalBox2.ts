/**
 * 确认提示框
 */
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { copyToClipboard, popNewMessage } from '../../utils/tools';

interface Props {
    title:string;
    content: string;
    extraInfo:string;// 
    copyBtnText:string;// 
    contentStyle?:string;
}

export class ModalBox2 extends Widget {
    public props: Props;
    public ok: (r?:any) => void;
    public cancel: () => void;

    constructor() {
        super();
    }
    public create() {
        super.create();
        this.config = { value: { group: 'top' } };
    }

    public quitClick() {
        this.cancel && this.cancel();
    }

    public copyBtnClick(e:any) {
        copyToClipboard(this.props.extraInfo);
        popNewMessage('复制成功');
        this.ok && this.ok();
    }

}
