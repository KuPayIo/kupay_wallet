/**
 * 挖矿及矿山排名
 */
// ============================== 导入
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { find, register } from '../../../store/store';
import { kpt2kt } from '../../../utils/tools';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class DividendItem extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    public create() {
        super.create();
        this.state = {};
        this.initData();
    }
    
    /**
     * 查看排名详情列表
     * @param ind 1 为矿山排名，2 为挖矿排名
     */
    public gotoMore(ind:number) {
        if (ind === 1) {
            popNew('app-view-mine-dividend-rankList', { data:this.state.mineList,ind:ind });
        } else {
            popNew('app-view-mine-dividend-rankList',  { data:this.state.miningList,ind:ind });
        }
        
    }

    /**
     * 当前页面加载更多排名数据
     * @param ind 1 为矿山排名，2 为挖矿排名
     */
    public getMore(ind:number) {
        if (ind === 1) {
            const msg = this.state.mineList;
            for (let i = this.state.minePage * 10;i < msg.length && i < (this.state.minePage + 1) * 10; i++) {
                this.state.mineRank.push({
                    index: i + 1,
                    name: msg[i][1] === '' ? '昵称未设置' : msg[i][1],
                    num: kpt2kt(msg[i][2])
                });
            }
            this.state.minePage += 1;
            if ((this.state.minePage + 1) * 10 < msg.length) {
                this.state.mineMore = true;
            } else {
                this.state.mineMore = false;                
            }
        } else {
            const msg = this.state.miningList;
            for (let i = this.state.miningPage * 10;i < msg.length && i < (this.state.miningPage + 1) * 10; i++) {
                this.state.miningRank.push({
                    index: i + 1,
                    name: msg[i][1] === '' ? '昵称未设置' : msg[i][1],
                    num: kpt2kt(msg[i][2])
                });
            }
            this.state.miningPage += 1;
            if ((this.state.miningPage + 1) * 10 < msg.length) {
                this.state.miningMore = true;
            } else {
                this.state.miningMore = false;                
            }
        }
        this.paint();
    }

    /**
     * 获取更新数据
     */
    public async initData() {
        const msg1 = find('mineRank');
        const msg2 = find('miningRank');
        this.state = {
            mineSecond:msg1.mineSecond,
            mineThird:msg1.mineThird,
            minePage:msg1.minePage,
            mineMore:msg1.mineMore,
            mineList:msg1.mineList,
            mineRank:msg1.mineRank,
            miningSecond:msg2.miningSecond,
            miningThird:msg2.miningThird,
            miningPage:msg2.miningPage,
            miningMore:msg2.miningMore,
            miningList:msg2.miningList,
            miningRank:msg2.miningRank
        };
        this.paint();
    }
}

register('mineRank', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});
register('miningRank', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});