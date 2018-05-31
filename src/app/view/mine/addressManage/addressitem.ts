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
        popNew('app-view-mine-addressManage-addritemDetails', { name: this.props.name, address: this.props.address });
    }
}