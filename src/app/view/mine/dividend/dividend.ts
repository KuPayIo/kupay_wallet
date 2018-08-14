/**
 * 分红统计页面 
 */
// ================================ 导入
import { Json } from '../../../../pi/lang/type';
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getBonusHistory, getDividHistory } from '../../../net/pull';
import { find, register } from '../../../store/store';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class Dividend extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }

    public setProps(props: Json, oldProps?: Json) {
        super.setProps(props,oldProps);
        this.state = {};
        this.initData();
        this.initEvent();
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    /**
     * 查看分红记录
     */
    public goHistory() {
        popNew('app-view-mine-dividend-dividendHistory',1);
    }

    /**
     * 获取更新数据
     */
    public initData() {
        const data = find('dividTotal');
        this.state = {
            totalDivid:data.totalDivid,
            totalDays:data.totalDays,
            thisDivid:data.thisDivid,
            yearIncome:data.yearIncome           
        };
        this.paint();
    }

    /**
     * 初始化事件
     */
    private initEvent() {
        // 这里发起通信
        getDividHistory();
    }
}
register('dividTotal', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});