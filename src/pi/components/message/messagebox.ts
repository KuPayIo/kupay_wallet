/**
 * 确认提示框
 */
import { Widget } from '../../widget/widget';

interface Props {
    type: string;
    text: string;
    center?: boolean;
}

export class MessageBox extends Widget {
    public props: Props;
    public ok: (r) => void;
    public cancel: () => void;


    constructor() {
        super();
    }
    public create() {
        super.create();
        this.config = { value: { group: "top" } };
    }

    public setProps(props: Props, oldProps: Props): void {
        super.setProps(props, oldProps);
        this.state = { isShow: false, input: "" };
        this.init();
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
    public inputChange(e) {
        this.state.input = e.value;
    }

    private init() {
        setTimeout(() => {
            this.state.isShow = true;
            this.paint();
        }, 100);
    }

}
