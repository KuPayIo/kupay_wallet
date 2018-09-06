/**
 * wallet home 
 */
import { Widget } from '../../../../pi/widget/widget';
import { popNew } from '../../../../pi/ui/root';

export class Home extends Widget {
    public ok:()=>void;
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            
        };
    }

    public backPrePage() {
        this.ok && this.ok();
    } 
}