/**
 * 消息框
 */
import { Widget } from '../../widget/widget';
import { notify } from '../../widget/event';
import { remove } from '../../ui/root';
import { addEvent, removeEvent } from '../../widget/scroller/dom';

interface Props {
    type: string;
    value: number;
    max?: number;
    min?: number;
    step?: number;
    precision?: number;//小数位
    showValue?: boolean;
}

export class Message extends Widget {
    public props: Props;

    private dragging = false;
    private isClick = false;
    private startX = 0;
    private currentX = 0;
    private startPosition;
    private currentPosition;
    private newPosition;
    private sliderSize = 1;

    constructor() {
        super();
    }

    public setProps(props: Props, oldProps: Props): void {
        super.setProps(props, oldProps);
        this.state = {};
        this.init();
    }


    private init() {
        this.props.value = this.props.value || 0
        this.props.max = this.props.max || 100;
        this.props.min = this.props.min || 0;
        this.props.step = this.props.step || 1;
        this.props.precision = this.props.precision || 0
        this.props.showValue = this.props.showValue || false;

        this.state.showValue = this.props.value / (this.props.max - this.props.min) * 100;

    }

    /**
     * 处理按钮按下
     */
    public doButtonDown(event) {
        event.preventDefault();
        this.onDragStart(event);
        addEvent(window, 'mousemove', this, true)
        addEvent(window, 'touchmove', this, true)
        addEvent(window, 'mouseup', this, true)
        addEvent(window, 'touchend', this, true)
        addEvent(window, 'contextmenu', this, true)
    }

    private onDragStart(event) {
        this.dragging = true;
        this.isClick = true;
        if (event.type === 'touchstart') {
            event.clientY = event.touches[0].clientY;
            event.clientX = event.touches[0].clientX;
        }
        this.startX = event.clientX;
        this.sliderSize = event.currentTarget.parentNode.parentNode.offsetWidth / 100;

        this.startPosition = this.state.showValue;
        this.newPosition = this.startPosition;
    }


    private onDragging(event) {
        // todo 处理滑动事件
        if (this.dragging) {
            this.isClick = false;
            let diff = 0;
            if (event.type === 'touchmove') {
                event.clientY = event.touches[0].clientY;
                event.clientX = event.touches[0].clientX;
            }
            this.currentX = event.clientX;
            diff = (this.currentX - this.startX) / this.sliderSize;

            this.newPosition = this.startPosition + diff;
            this.setPosition(this.newPosition);
        }
    }

    private onDragEnd(event) {
        if (this.dragging) {
            /*
             * 防止在 mouseup 后立即触发 click，导致滑块有几率产生一小段位移
             * 不使用 preventDefault 是因为 mouseup 和 click 没有注册在同一个 DOM 上
             */
            setTimeout(() => {
                this.dragging = false;
                if (!this.isClick) {
                    this.setPosition(this.newPosition);
                }
            }, 0);

            removeEvent(window, 'mousemove', this, true)
            removeEvent(window, 'touchmove', this, true)
            removeEvent(window, 'mouseup', this, true)
            removeEvent(window, 'touchend', this, true)
            removeEvent(window, 'contextmenu', this, true)
        }
    }

    public handleEvent(e) {
        switch (e.type) {
            case 'mousemove':
            case 'touchmove':
                this.onDragging(e);
                break;
            case 'mouseup':
            case 'touchend':
            case 'contextmenu':
                this.onDragEnd(e);
                break;
            default:
        }
    }

    /**
     * 数量改变
     */
    public selectCountChange(e) {
        this.showValue(e.value);
    }

    private setPosition(newPosition) {
        if (newPosition === null) return;
        if (newPosition < 0) {
            newPosition = 0;
        } else if (newPosition > 100) {
            newPosition = 100;
        }

        const lengthPerStep = 100 / ((this.props.max - this.props.min) / this.props.step);
        const steps = Math.round(newPosition / lengthPerStep * Math.pow(10, this.props.precision));
        let value = steps * lengthPerStep * (this.props.max - this.props.min) * 0.01 + this.props.min;
        value = value / Math.pow(10, this.props.precision);
        this.showValue(value);
    }

    private showValue(value) {
        this.state.showValue = value / (this.props.max - this.props.min) * 100;
        this.props.value = value;
        this.paint();

        notify(this.parentNode, 'ev-slider-change', { value: this.props.value });
    }

}
