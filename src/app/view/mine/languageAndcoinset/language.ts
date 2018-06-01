/**
 * language
 */
import { Widget } from '../../../../pi/widget/widget';

export class Language extends Widget {
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
                { index:0,lan:'中文',checked:true },
                { index:1,lan:'英文' }
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