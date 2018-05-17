/**
 * loading逻辑处理
 */
import { Widget } from '../../widget/widget';
import { notify } from '../../widget/event';

interface Props {
    text:string;//加载文本
}

interface State{
    circular:string;//svg内容
}
export class Loading extends Widget {
    public props: Props;
    public state: State;
    constructor() {
        super();
    }

    public setProps(props:Props,oldProps:Props){
        super.setProps(props,oldProps);
        this.state = {
            circular:`<svg viewBox='25 25 50 50' class='pi-circular'>
            <circle cx='50' cy='50' r='20' fill='none' class="pi-path">
            </circle>
            </svg>`
        };
    }
}
