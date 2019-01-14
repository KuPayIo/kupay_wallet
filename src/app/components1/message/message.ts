/**
 * 消息框
 */
import { Widget } from '../../../pi/widget/widget';

interface Props {
    content: string;
}

export class Message extends Widget {
    public props: any;
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
        this.props = { ...this.props,isShow: false,pi_norouter:true };
        this.init();
    }

    private init() {
        setTimeout(() => {
            this.props.isShow = true;
            this.paint();
        }, 100);
        setTimeout(() => {
            this.props.isShow = false;
            this.paint();
            setTimeout(() => {
                this.ok && this.ok();
            }, 300);
        }, 2000);
    }

}
