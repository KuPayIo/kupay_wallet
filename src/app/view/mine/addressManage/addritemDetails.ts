/**
 * 地址详情
 */
// ======================================导入
import { Widget } from '../../../../pi/widget/widget';
// ===========================================导出
export class AddritemDetails extends Widget {
    public ok: () => void;
    constructor() {
        super();
        this.state = {
            name: 'BTC 001',
            money: '2.00',
            address: 'Kye4gFqsnotKvjoVxNy1xoe2CRiC9GdZ8UdtXMcksgUWVFTmam2f'
        };
    }

    public goback() {
        this.ok && this.ok();
    }

}