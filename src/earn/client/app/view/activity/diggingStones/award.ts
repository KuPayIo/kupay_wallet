/**
 * award
 */
import { Widget } from '../../../../../../pi/widget/widget';

export class Award extends Widget {
    public ok:() => void;
    public create() {
        super.create();
        this.props = {
            activeNumber:1
        };
    }
    public switchAward(e:any,index:number) {
        if (this.props.activeNumber === index) return;
        this.props.activeNumber = index;
        this.paint();
    }
    public backClick() {
        this.ok && this.ok();
    }
}