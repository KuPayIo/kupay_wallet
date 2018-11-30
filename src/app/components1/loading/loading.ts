import { Widget } from '../../../pi/widget/widget';

/**
 * loading逻辑处理
 */

interface Props {
    text:string;// 加载文本
}

interface State {
    startTime:number;
    circular:string;// svg内容
}
export class Loading extends Widget {
    public props: Props;
    public state: State;
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
        this.state = {
            circular:`<svg viewBox='25 25 50 50' class='pi-circular'>
            <circle cx='50' cy='50' r='20' fill='none' class="pi-path">
            </circle>
            </svg>`,
            startTime:new Date().getTime(),
        };
    }
    public close() {
        const INTERVAL = 500;
        const endTime = new Date().getTime();
        const interval = endTime - this.state.startTime;
        if (interval >= INTERVAL) {
            this.ok && this.ok();
        } else {
            setTimeout(() => {
                this.ok && this.ok();
            },INTERVAL - interval);
        }
    }
}
