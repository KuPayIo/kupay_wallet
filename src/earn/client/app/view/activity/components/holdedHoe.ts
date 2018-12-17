/**
 * holded hoe
 */
import { notify } from '../../../../../../pi/widget/event';
import { Widget } from '../../../../../../pi/widget/widget';

interface Props {
    holdedNumber:number; // holded hoe number
    img:string;          // img url
    selected:boolean;   // selected
}
export class HoldedHoe extends Widget {
    public props:any;
    public setProps(props:Props,oldProps:Props) {
        this.props = {
            ...props
        };
        super.setProps(this.props,oldProps);
    }
    public selectHoeClick(event:any) {
        notify(event.node,'ev-hoe-click',{});
    }
}