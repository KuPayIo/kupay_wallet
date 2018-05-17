/**
 * 选择框的逻辑处理
 */
import { Widget } from '../../widget/widget';
import { notify } from '../../widget/event';

interface Props {
    type: string;
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
        let oldType = this.props.type;
        if (oldType === "disabled") return
        let newType = "";
        switch (oldType) {
            case "true": newType = "false"; break;
            case "false": newType = "true"; break;
            case "indeterminate": newType = "true"; break;
        }
        this.props.type = newType;
        notify(event.node, 'ev-checkbox-click', { oldType: oldType, newType: newType, index: this.props.index });
        this.paint();
    }

}
