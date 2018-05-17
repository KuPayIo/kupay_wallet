/**
 * 消息框
 */
import { Widget } from '../../widget/widget';
import { notify } from '../../widget/event';

interface Props {
    value: number
    min?: number;
    max?: number;
    interval?: number;
}

export class SelectCount extends Widget {
    public props: Props;
    public timerRef: number = 0;

    constructor() {
        super();
    }

    public setProps(props: Props, oldProps: Props): void {
        super.setProps(props, oldProps);
        this.state = {};
        this.init();
    }


    private init() {
        this.state.style = { padding: "0px 40px", textAlign: "center" }
        this.props.value = this.props.value || 0;
        this.props.min = this.props.min || 0
        this.props.max = this.props.max || 100;
        this.props.interval = this.props.interval || 200;

    }

    /**
     * 点击左方
     */
    public tapLeft() {
        if (this.timerRef) {
            clearTimeout(this.timerRef);
            this.timerRef = 0;
        }
        changeCount(this, -1, false);
    }

    /**
     * 长按左方
     */
    public langTapLeft() {
        changeCount(this, -1, true);
    }

    /**
     * 点击右方
     */
    public tapRight() {
        if (this.timerRef) {
            clearTimeout(this.timerRef);
            this.timerRef = 0;
        }
        changeCount(this, 1, false);
    }

    /**
     * 长按右方
     */
    public langTapRight() {
        changeCount(this, 1, true);
    }

    /**
     * 输入数据改变
     */
    public inputChange(e) {
        const value = Number.parseFloat(e.value);
        if (!!value) this.props.value = value;
    }

    /**
     * 输入光标消失
     */
    public inputBlur() {
        notify(this.parentNode, 'ev-selectcount', { value: this.props.value });
    }

    /**
     * 检查状态
     */
    private checkStatus() {
        this.state.hideLeft = false;
        this.state.hideRight = false;
        if (this.props.value <= this.props.min) {
            this.state.hideLeft = true;
        }
        if (this.props.value >= this.props.max) {
            this.state.hideRight = true;
        }
    }

    /**
     * 显示数据
     */
    public showValue() {
        notify(this.parentNode, 'ev-selectcount', { value: this.props.value });
        this.checkStatus();
        this.paint();
    }

}

/**
 * @description 更改选择数量
 * @param startTimeout--是否开启定时器
 * @example
 */
const changeCount = (w, step, startTimeout) => {
    const to = w.props.value + step;
    if (step > 0) {
        if (to >= w.props.max) {
            w.props.value = w.props.max;
            w.timerRef = 0;
        } else {
            w.props.value = to;
            if (startTimeout) {
                w.timerRef = setTimeout(() => { changeCount(w, step, true); }, w.props.interval);
            }
        }
    } else if (step < 0) {
        if (to <= w.props.min) {
            w.props.value = w.props.min;
            w.timerRef = 0;
        } else {
            w.props.value = to;
            if (startTimeout) {
                w.timerRef = setTimeout(() => { changeCount(w, step, true); }, w.props.interval);
            }
        }
    }
    w.showValue()
}
