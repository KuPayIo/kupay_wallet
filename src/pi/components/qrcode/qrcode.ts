/**
 * 二维码组件
 */
import { Widget } from '../../widget/widget';
import { notify } from '../../widget/event';
import { QrcodeSrc } from './qrcode_src';
import { getRealNode } from '../../widget/painter';

interface Props {
    value: string;
    size: number;
}

interface State {
    circleProgress: string;

}

export class Qrcode extends Widget {
    public props: Props;
    constructor() {
        super();
    }

    public firstPaint() {
        let wrapper = <HTMLElement>getRealNode(this.tree);
        console.log(this.tree, wrapper)
        var qrcode: any = new QrcodeSrc(wrapper.children[0], {
            width: this.props.size,
            height: this.props.size
        });
        qrcode.makeCode(this.props.value);

    }
}