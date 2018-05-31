/**
 * coin set
 */
import { Widget } from '../../../../pi/widget/widget';

export class CoinSet extends Widget {
    public ok: () => void;
    constructor() {
        super();
        this.props = {
            checkedIndex:0,
            data:[
                { index:0,lan:'CNY',checked:true },
                { index:1,lan:'USD' }
            ]
        };
    }

    public radioChangeListener(event:any) { 
        for (const i in this.props.data) {
            if (event.index !== this.props.data[i].index) {
                this.props.data[i].checked = false;
            }
        }
        this.paint();       
    }   

    public backPrePage() {
        this.ok && this.ok();
    }
}