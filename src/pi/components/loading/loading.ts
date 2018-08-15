/**
 * loading逻辑处理
 */
import { Widget } from '../../widget/widget';

interface Props {
    text:string;// 加载文本
}

interface State {
    beginTime:number;
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

        console.log('loading start------');
    }
    public destroy() {
        console.log('loading end-------');

        return super.destroy();
    }
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.state = {
            circular:`<svg viewBox='25 25 50 50' class='pi-circular'>
            <circle cx='50' cy='50' r='20' fill='none' class="pi-path">
            </circle>
            </svg>`,
            beginTime:0
        };
    }
    public attach() {
        this.state.beginTime = new Date().getTime();
    }
    /* public close() {

    } */
}
