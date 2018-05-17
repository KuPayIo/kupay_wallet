


/**
 * 进度条的逻辑处理
 */
import { Widget } from '../../widget/widget';
import { notify } from '../../widget/event';

interface Props {
    type: string;
    value: number;
    color: string;
    status: string;
}

interface State {
    circleProgress: string;

}

export class Checkbox extends Widget {
    public props: Props;
    public state: State;
    constructor() {
        super();
    }
    public setProps(props: Props, oldProps: Props): void {
        super.setProps(props, oldProps);
        this.state = <any>{};
        this.init();
    }
    private init() {
        if (this.props.status === "exception") {
            this.props.color = "#f56c6c";
        } else if (this.props.status === "success") {
            this.props.color = "#67c23a";
        }
        if (this.props.type !== "circle") return;
        this.state.circleProgress = `<svg viewBox="0 0 100 100">
        <path d="M 50 50 m 0 -47 a 47 47 0 1 1 0 94 a 47 47 0 1 1 0 -94" stroke="#e5e9f2" stroke-width="4.8" fill="none" class="el-progress-circle__track"></path>
        <path d="M 50 50 m 0 -47 a 47 47 0 1 1 0 94 a 47 47 0 1 1 0 -94" stroke-linecap="round" stroke="${this.props.color || '#409eff'}" stroke-width="4.8"fill="none" 
        class="el-progress-circle__path" style="stroke-dasharray: 299.08px, 299.08px; stroke-dashoffset: ${300 - this.props.value * 300}px; 
        transition: stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease;"></path>
        </svg>`;
    }

}
