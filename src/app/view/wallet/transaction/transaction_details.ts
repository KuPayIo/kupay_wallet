/**
 * 交易详情
 */

import { Widget } from '../../../../pi/widget/widget';

interface Props {
    pay: string;
    result: string;
    toAddr: string;
    fee: string;
    info: string;
    fromAddr: string;
    showTime: string;
    hash: string;
}

export class AddAsset extends Widget {
    public props: Props;

    public ok: () => void;

    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init(): void {
        this.state = { title: '交易详情' };
    }

    /**
     * 处理关闭
     */
    public doClose() {
        this.ok && this.ok();
    }

}
