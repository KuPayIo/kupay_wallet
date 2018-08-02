/**
 * 分红统计页面 
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';

interface Props {
    totaldays:string;
    totalmoney:string;
}

export class Dividend extends Widget {
    public ok: () => void;
    public props: Props;
    constructor() {
        super();
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    public goDetail() {
        popNew('app-view-mine-dividend-dividendHistory');
    }
}