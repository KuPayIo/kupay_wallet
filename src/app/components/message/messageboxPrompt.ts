/**
 * 确认提示框--验证
 */
import { Widget } from '../../../pi/widget/widget';

interface Props {
    content: string;
    title: string;
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
        this.state = {
            input:''
        };
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

}
