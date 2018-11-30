/**
 * wallet home 
 */
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getMineRank, getMiningRank } from '../../../net/pull';
import { getStore, register } from '../../../store/memstore';
// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class Home extends Widget {
    public ok:() => void;
    public language:any;

    public create() {
        super.create();
        this.language = this.config.value[getLang()];
        this.state = {
            tabs:[{
                tab:'0',
                data:[],
                totalNum:0,
                myRank:1,
                fg:0
            },{
                tab:'1',
                data:[],
                totalNum:0,
                myRank:1,
                fg:1
            }],
            activeNum:0
        };
        this.initData();
        this.initEvent();
    }

    /**
     * 
     * 获取更新数据
     */
    public initData() {
        const data1 = getStore('activity/mining/miningRank');  // 挖矿排名
        if (data1) {
            this.state.tabs[0].data = data1.rank;
            this.state.tabs[0].myRank = data1.myRank;
        }
        
        const data2 = getStore('activity/mining/mineRank');   // 矿山排名
        if (data2) {
            this.state.tabs[1].data = data2.rank;
            this.state.tabs[1].myRank = data2.myRank;
        }

        const mining = getStore('activity/mining/total');
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
     * 刷新页面
     */
    public refreshPage() { 
        this.initEvent();
    }

    /**
     * 更新事件
     */
    public initEvent() {
        getMineRank(100);
        getMiningRank(100);
    }
}

register('activity/mining/miningRank', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});
register('activity/mining/mineRank', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});
register('activity/mining/total', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});
