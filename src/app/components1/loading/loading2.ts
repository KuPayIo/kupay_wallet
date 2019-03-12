import { Widget } from '../../../pi/widget/widget';

/**
 * loading逻辑处理
 */

export class Loading2 extends Widget {
    public props: any;
    public ok:() => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.config = { value: { group: 'top' } };
    }
    public setProps(props:JSON,oldProps:JSON) {
        super.setProps(props,oldProps);
        this.props = {
            ...this.props,
            pi_norouter:true,
            startTime:new Date().getTime()
        };
    }
    public close() {
        const INTERVAL = 500;
        const endTime = new Date().getTime();
        const interval = endTime - this.props.startTime;
        if (interval >= INTERVAL) {
            this.ok && this.ok();
        } else {
            setTimeout(() => {
                this.ok && this.ok();
            },INTERVAL - interval);
        }
    }
}
