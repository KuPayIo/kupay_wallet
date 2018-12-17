/**
 * digging stones home
 */
import { Widget } from '../../../../../../../pi/widget/widget';

export class DiggingStonesHome extends Widget {
    public ok:() => void;
    public props:any;
    public create() {
        this.props = {
            hoeSelected:0,
            stoneType:1,
            stoneIndex:0
        };
    }
    public closeClick() {
        this.ok && this.ok();
    }
    public selectHoeClick(e:any,index:number) {
        console.log('select index',index);
        this.props.hoeSelected = index;
        this.paint();
    }
}