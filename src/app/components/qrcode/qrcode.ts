/**
 * 二维码组件
 */
import { getRealNode } from '../../../pi/widget/painter';
import { Widget } from '../../../pi/widget/widget';
import { QrcodeSrc } from './qrcode_src';

interface Props {
    value: string;
    size: number;
}

export class Qrcode extends Widget {
    public props: Props;
    constructor() {
        super();
    }

    public firstPaint() {
        const wrapper = <HTMLElement>getRealNode(this.tree);
        console.log(this.tree, wrapper);
        const qrcode: any = new QrcodeSrc(wrapper.children[0], {
            width: this.props.size,
            height: this.props.size
        });
        qrcode.makeCode(this.props.value);

    }
}