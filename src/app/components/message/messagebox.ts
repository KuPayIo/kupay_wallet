/**
 * 确认提示框
 */
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { copyToClipboard } from '../../utils/tools';

interface Props {
    itype: string;
    content: string;
    center?: boolean;
    inputType?:string;
    placeHolder?:string;
    showQuit?:boolean;// 是否显示右上角叉
    extraInfo?:string;// itype = "extra" 时有效
    copyBtnText?:string;// itype = "extra"  button文字
    contentStyle?:string;
    okButton?:string;// 确定按钮的名称
    cancelButton?:string;// 取消按钮的名称
    okButtonStyle?:string;// 确认按钮的样式
    cancelButtonStyle?:string;// 取消按钮的样式
}

export class MessageBox extends Widget {
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
        this.state = { isShow: false, input: '' };
        this.init();
    }

    public quitClick() {
        this.cancel && this.cancel();
    }
    /**
     * 点击确认
     */
    public doClickSure() {
        this.ok && this.ok(this.state.input);
    }

    /**
     * 点击取消
     */
    public doClickCancel() {
        this.cancel && this.cancel();
    }

    /**
     * 提示框数据改变
     */
    public inputChange(e:any) {
        this.state.input = e.value;
    }

    public copyBtnClick(e:any) {
        copyToClipboard(this.props.extraInfo);
        popNew('app-components-message-message', { itype: 'success', content: '复制成功', center: true });
        this.ok && this.ok();
    }

    private init() {
        setTimeout(() => {
            this.state.isShow = true;
            this.paint();
        }, 100);
    }

}
