/**
 * 确认提示框
 */
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { copyToClipboard } from '../../utils/tools';

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

    public setProps(props: Props, oldProps: Props): void {
        super.setProps(props, oldProps);
        this.init();
    }

    public quitClick() {
        this.cancel && this.cancel();
    }

    public copyBtnClick(e:any) {
        copyToClipboard(this.props.extraInfo);
        popNew('app-components1-message-message', { itype: 'success', content: '复制成功', center: true });
        this.ok && this.ok();
    }

    private init() {
    }

}
