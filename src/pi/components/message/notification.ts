/**
 * 确认提示框
 */
import { Widget } from '../../widget/widget';

interface Props {
    title: string;
    content: string;
    manuallyClose?: boolean;
}

export class Notification extends Widget {
    public props: Props;
    public timerRef: number = 0;
    public ok: () => void;


    constructor() {
        super();
    }
    public create() {
        super.create();
        this.config = { value: { group: "download" } };
    }

    public setProps(props: Props, oldProps: Props): void {
        super.setProps(props, oldProps);
        this.init();
    }

    /**
     * 点击确认
     */
    public doClose() {
        if (this.timerRef) {
            clearTimeout(this.timerRef);
            this.timerRef = 0;
        }
        this.ok && this.ok();
    }

    private init() {
        if (!this.props.manuallyClose) {
            this.timerRef = setTimeout(() => {
                this.timerRef = 0;
                this.doClose();
            }, 3000);
        }
    }

}
