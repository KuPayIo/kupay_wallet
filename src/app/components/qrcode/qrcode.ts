/**
 * 二维码组件
 */
import { Widget } from '../../../pi/widget/widget';
import { QRious } from './qrious';

interface Props {
    value: string;
    size: number;
}

export class Qrcode extends Widget {
    public props: Props;
    constructor() {
        super();
    }

    public attach() {
        const qr = new QRious({
            element: document.getElementById('qrcode-img'),
            value: this.props.value,
            size:this.props.size
        });

    }
}