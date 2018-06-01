/**
 * coin set
 */
import { Widget } from '../../../../pi/widget/widget';

export class CoinSet extends Widget {
    public ok: () => void;
    constructor() {
        super();
        
    }

    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            checkedIndex:0,
            data:[
                { index:0,lan:'CNY',checked:true },
                { index:1,lan:'USD' }
            ]
        };
    }
    public radioChangeListener(event:any) { 
        for (const i in this.state.data) {
            if (event.index !== this.state.data[i].index) {
                this.state.data[i].checked = false;
            }
        }
        this.paint();       
    }   

    public backPrePage() {
        this.ok && this.ok();
    }
}