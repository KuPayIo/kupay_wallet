/**
 * 确认提示框
 */
import { Widget } from '../../widget/widget';
import { notify } from '../../widget/event';

interface Props {
    list: any[];
    activeNum?: number;
    type?:string;
    position?: string;
}

export class Tabs extends Widget {
    public props: Props;
    public ok: () => void;


    constructor() {
        super();
    }

    public setProps(props: Props, oldProps: Props): void {
        super.setProps(props, oldProps);
        this.props.activeNum = this.props.activeNum || 0;
        this.props.type = this.props.type || "normal";
        this.props.position = this.props.position || "top";
        this.init();
    }

    public doClick(event, value) {
        notify(event.node, 'ev-tabs-change', { value: value });
    }

    private init() {
    }

}
