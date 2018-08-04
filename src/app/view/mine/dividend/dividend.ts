/**
 * 分红统计页面 
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { getDividend } from '../../../store/conMgr';

interface State {
    totalDivid:string;
    totalHold:string;
    thisDivid:string;
    totalDays:string;
}

export class Dividend extends Widget {
    public ok: () => void;
    public state : State;
    constructor() {
        super();
    }

    public create() {
        this.state = {
            totalDivid:'0.9152',
            totalHold:'520,000',
            thisDivid:'0.15',
            totalDays:'8'
        };
        getDividend();
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    public goHistory() {
        popNew('app-view-mine-dividend-dividendHistory',1);
    }

}