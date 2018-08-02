/**
 * 分红统计页面 
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';

export class Dividend extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    public goDetail() {
        popNew('app-view-mine-dividend-dividendHistory',1);
    }
}