/**
 * about us
 */
import { Widget } from '../../../../pi/widget/widget';

export class Aboutus extends Widget {
    public ok: () => void;
    constructor() {
        super();
        this.state = {
            data:[
                { value:'隐私条款',components:'app-view-aboutus-privacypolicy' },
                { value:'用户协议',components:'app-view-aboutus-useragreement' },
                { value:'版本更新',components:'' }
            ]
        };
    }

    public itemClick(e:any,index:number) {       
        if (this.state.data[index].components !== '') {
            // popNew(this.state.data[index].components);
        } else {
            // popNew("app-view-aboutus-message", { type: "success", content: "当前已是最新版本", center: true })
        }
    }

    public backPrePage() {
        this.ok && this.ok();
    }
}