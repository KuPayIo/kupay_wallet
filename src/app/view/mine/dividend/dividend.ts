/**
 * 分红统计页面 
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { getDividend } from '../../../store/conMgr';
import { wei2Eth } from '../../../utils/tools';

interface State {
    totalDivid:number; // 累计分红
    totalHold:number;  // 持有KT数量
    thisDivid:number;  // 本次分红
    totalDays:number;  // 分红天数
    yearIncome:number; // 年华收益
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
            totalDays:0,
            yearIncome:0
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
            thisDivid:wei2Eth(msg.value[2]),
            yearIncome:0           
        };
        this.paint();
    }
}