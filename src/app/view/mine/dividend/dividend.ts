/**
 * 分红统计页面 
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { getDividend } from '../../../store/conMgr';
import { wei2Eth } from '../../../utils/tools';

interface State {
    totalDivid:number;
    totalHold:number;
    thisDivid:number;
    totalDays:number;
}

export class Dividend extends Widget {
    public ok: () => void;
    public state : State;
    constructor() {
        super();
    }

    public create() {
        this.state = {
            totalDivid:0,
            totalHold:0,
            thisDivid:0,
            totalDays:0
        };
        this.initData();
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    public goHistory() {
        popNew('app-view-mine-dividend-dividendHistory',1);
    }

    public async initData() {
        const msg = await getDividend();
        this.state = {
            totalDivid:wei2Eth(msg.value[0]),
            totalHold:this.props,
            totalDays:msg.value[1],
            thisDivid:wei2Eth(msg.value[2])           
        };
        this.paint();
    }
}