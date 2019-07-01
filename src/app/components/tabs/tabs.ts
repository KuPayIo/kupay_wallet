/**
 * 页签切换
 * 
 * 这是一个最简单的页签切换
 */
import { notify } from '../../../pi/widget/event';
import { Widget } from '../../../pi/widget/widget';

interface Props {
    list: any[];
    activeNum?: number;
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
        this.init();
    }

    public doClick(event: any, value: number) {
        this.props.activeNum = value;
        this.paint();
        notify(event.node, 'ev-tabs-change', { value: value });
    }
    public importSuccess() {
        console.log('---------importSuccess');
    }

    private init() {
        //
    }
}
