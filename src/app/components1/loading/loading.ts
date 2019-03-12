import { Widget } from '../../../pi/widget/widget';

/**
 * loading逻辑处理
 */

interface Props {
    text:string;// 加载文本
}

export class Loading extends Widget {
    public props: any;
    public ok:() => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.config = { value: { group: 'top' } };
    }
    public setProps(props:Props,oldProps:Props) {
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
