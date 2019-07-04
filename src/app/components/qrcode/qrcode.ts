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
    public qr:any;
    constructor() {
        super();
    }
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        if (this.qr) {
            this.qr = new QRious({
                element: document.getElementById('qrcode-img'),
                value: this.props.value,
                size:this.props.size
            });
        }
    }

    public attach() {
        this.qr = new QRious({
            element: document.getElementById('qrcode-img'),
            value: this.props.value,
            size:this.props.size
        });
    }
}