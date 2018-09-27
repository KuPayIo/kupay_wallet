/**
 * wallet home 
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getMineRank, getMiningRank } from '../../../net/pull';
import { find, register } from '../../../store/store';
import { getLanguage } from '../../../utils/tools';
// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class Home extends Widget {
    public ok:() => void;

    public create() {
        super.create();
        const cfg = getLanguage(this); 
        this.state = {
            tabs:[{
                tab:cfg.tabs[0],
                data:[],
                totalNum:0,
                myRank:1,
                fg:0
            },{
                tab:cfg.tabs[1],
                data:[],
                totalNum:0,
                myRank:1,
                fg:1
            }],
            activeNum:0,
            cfgData:cfg
        };
        this.initData();
        this.initEvent();
    }

    /**
     * 获取更新数据
     */
    public initData() {
        const data1 = find('miningRank');
        if (data1) {
            this.state.tabs[0].data = data1.miningRank;
            this.state.tabs[0].myRank = data1.myRank;
        }
        
        const data2 = find('mineRank');
        if (data2) {
            this.state.tabs[1].data = data2.mineRank;
            this.state.tabs[1].myRank = data2.myRank;
        }

        const mining = find('miningTotal');
        if (mining) {
            this.state.tabs[1].totalNum = mining.totalNum;
            this.state.tabs[0].totalNum = mining.holdNum;
        }
        
        this.paint();
    }
    
    /**
     * 导航栏切换
     */
    public tabsChangeClick(value: number) {
        this.state.activeNum = value;
        this.paint();
    }

    public goHistory() {
        popNew('app-view-earn-mining-miningHistory');
    }

    public backPrePage() {
        this.ok && this.ok();
    } 

    /**
     * 更新事件
     */
    public initEvent() {
        getMineRank(100);
        getMiningRank(100);
    }
}

register('miningRank', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});
register('mineRank', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});
register('miningTotal', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});