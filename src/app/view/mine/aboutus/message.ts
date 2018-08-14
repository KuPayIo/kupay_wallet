/**
 * 消息框
 */
interface Props {
    itype: string;
    text: string;
    center?: boolean;
}
// =============================================导入
import { Widget } from '../../../../pi/widget/widget';
// ==============================================导出
export class Message extends Widget {
    public props: Props;
    public ok: () => void;

    constructor() {
        super();
    }
    public create() {
        super.create();
        this.config = { value: { group: 'pop_tip' } };
    }

    public setProps(props: Props, oldProps: Props): void {
        super.setProps(props, oldProps);
        this.state = { isShow: false };
        this.init();
    }

    private init() {
        setTimeout(() => {
            this.state.isShow = true;
            this.paint();
        }, 100);
        setTimeout(() => {
            this.state.isShow = false;
            this.paint();
            setTimeout(() => {
                this.ok && this.ok();
            }, 300);
        }, 3000);
    }

}
