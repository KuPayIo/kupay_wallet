/**
 * 选择框的逻辑处理
 */
import { notify } from '../../../pi/widget/event';
import { Widget } from '../../../pi/widget/widget';

interface Props {
    itype: string;
    text: string;
    index: number;
    reset: number;
}

export class Checkbox extends Widget {
    public props: Props;
    constructor() {
        super();
    }
    public doClick(event: any) {
        const oldType = this.props.itype;
        if (oldType === 'disabled') return;
        let newType = '';
        switch (oldType) {
            case 'true': newType = 'false'; break;
            case 'false': newType = 'true'; break;
            case 'indeterminate': newType = 'true'; break;
            default:
        }
        this.props.itype = newType;
        notify(event.node, 'ev-checkbox-click', { oldType: oldType, newType: newType, index: this.props.index });
        this.paint();
    }

}
