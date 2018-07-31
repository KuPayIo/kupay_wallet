/**
 * 确认提示框--验证
 */
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';

interface Props {
    content: string;
    title: string;
    tipsTitle:string;
    tipsImgUrl:string;
    confirmCallBack:Function;
    confirmErrorText:string;
    inputType?:string;
    placeHolder?:string;
    contentStyle?:string;
}

export class MessageBoxVerify extends Widget {
    public props: Props;
    public ok: (r:any) => void;
    public cancel: () => void;

    constructor() {
        super();
    }
    public create() {
        super.create();
        this.config = { value: { group: 'top' } };
    }

    /**
     * 点击确认
     */
    public doClickSure() {
        const close = popNew('pi-components-loading-loading', { text: '验证中...' });
        setTimeout(() => {
            close.callback(close.widget);
            if (this.props.confirmCallBack(this.state.input)) {
                this.ok && this.ok(this.state.input);
            } else {
                this.state.input = '';
                popNew('app-components-message-message', { itype: 'error', content: this.props.confirmErrorText, center: true });
                this.paint();
            }
        },1000);
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

}
