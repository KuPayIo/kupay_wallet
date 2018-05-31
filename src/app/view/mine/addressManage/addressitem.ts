/**
 * 地址管理-每条记录
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';

export class Addressitem extends Widget {
    constructor() {
        super();
    }

    public goDetails() {
        popNew('app-view-wallet-transaction-receipt', {
            currencyBalance: this.props.money,
            addr: this.props.address,
            title: this.props.name
        });
    }
}