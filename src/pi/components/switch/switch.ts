/**
 * 开关的逻辑处理
 */
import { Widget } from '../../widget/widget';
import { notify } from '../../widget/event';

interface Props {
    type: boolean;
    activeColor: string;
    inactiveColor: string;
}

export class Switch extends Widget {
    public props: Props;
    constructor() {
        super();
    }
    public doClick(event: any) {
        let oldType = !!this.props.type;
        let newType = !oldType;
        this.props.type = newType;
        notify(event.node, 'ev-switch-click', { oldType: oldType, newType: newType });
        this.paint();
    }

}
