/**
 * 确认提示框
 */
import { Widget } from '../../../pi/widget/widget';

interface Props {
    itype: string;
    text: string;
    center?: boolean;
    inputType?:string;
    placeHolder?:string;
    showQuit?:boolean;// 是否显示右上角叉
    extraInfo?:string;// itype = "extra" 时有效
    contentStyle?:string;
}

export class MessageBox extends Widget {
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

    private init() {
        setTimeout(() => {
            this.state.isShow = true;
            this.paint();
        }, 100);
    }

}
