/**
 * red-envelope details
 */
import { Widget } from '../../../../pi/widget/widget';

export class RedEnvelopeDetails extends Widget {
    public ok:() => void;
    public create() {
        super.create();
        this.state = {
            rules:['1.安装Fairblock，创建钱包',
                '2.在钱包里点击发现-发红包',
                '3.输入收到的红包码，红包金额将自动到账',
                '4.同一个红包，每人只能领取一次']
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }

}