/**
 * 开关组件
 * {types:true,activeColor:"linear-gradient(to right,#318DE6,#38CFE7)",inactiveColor:"#dddddd"}
 * types:是否选中
 * activeColor:选中后的颜色
 * inactiveColor：未选中的颜色
 */
import { notify } from '../../../pi/widget/event';
import { Widget } from '../../../pi/widget/widget';

interface Props {
    types: boolean;
    activeColor?: string;
    inactiveColor?: string;
}

export class Switch extends Widget {
    public props: Props;
    constructor() {
        super();
    }
    public doClick(event: any) {
        const oldType = !!this.props.types;
        const newType = !oldType;
        this.props.types = newType;
        notify(event.node, 'ev-switch-click', { oldType: oldType, newType: newType });
        this.paint();
    }

}
