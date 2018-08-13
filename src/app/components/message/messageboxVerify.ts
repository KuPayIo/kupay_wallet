/**
 * 确认提示框--验证
 */
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { find } from '../../store/store';

interface Props {
    content: string;
    title: string;
    tipsTitle:string;
    tipsImgUrl:string;
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
    public async doClickSure() {
        if (this.state.input.length === 0) {
            popNew('app-components-message-message', { itype: 'error', content: '密码不能为空,请重新输入', center: true });
            
            return;
        }
        this.ok && this.ok(this.state.input);
    }

    /**
     * 点击取消
     */
    public doClickCancel() {
        const ls = find('lockScreen');
        // 如果没有被锁住
        if (!ls.locked) {
            this.cancel && this.cancel();
        }
    }

    /**
     * 提示框数据改变
     */
    public inputChange(e:any) {
        this.state.input = e.value;
    }

}
