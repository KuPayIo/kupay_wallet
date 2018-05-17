/**
 * 消息框
 */
import { Widget } from '../../widget/widget';
import { notify } from '../../widget/event';
import { remove } from '../../ui/root';

interface Props {
    type: string;
    text: string;
    center?: boolean;
}

export class Message extends Widget {
    public props: Props;
    public ok: () => void;

    constructor() {
        super();
    }
    public create() {
        super.create();
        this.config = { value: { group: "pop_tip" } };
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
