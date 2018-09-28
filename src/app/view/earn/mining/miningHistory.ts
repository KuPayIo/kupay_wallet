/**
 * 分红领取记录，挖矿记录
 */
// ================================ 导入
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getMiningHistory } from '../../../net/pull';
import { find, getBorn, register } from '../../../store/store';
import { PAGELIMIT } from '../../../utils/constants';
import { getLanguage } from '../../../utils/tools';

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

    public create() {
        super.create();
        this.state = {
            data:[],
            hasMore:false,
            cfgData:getLanguage(this),
            start:0,
            refresh:true
        }; 
        this.initData();
    }
    
    /**
     * 获取更新数据
     */
    public async initData() {
        const data = find('miningHistory');  
        if (data) {
            const hList = data.list;
            if (hList && hList.length > this.state.data.length) {
                console.log('load more from local');
                  
            } else {
                console.log('load more from server');
                getMiningHistory(this.state.start);
            }
        } else {
            console.log('load more from server');
            getMiningHistory(this.state.start);
        }
        this.loadMore();  

        this.paint();
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    /**
     *  实际加载数据
     */
    public async loadMore() {
        const data = find('miningHistory');  
        if (!data) return;
        const hList = data.list;
        const start = this.state.data.length;
        this.state.data = this.state.data.concat(hList.slice(start,start + PAGELIMIT));
        this.state.start = data.start;
        this.state.hasMore = data.canLoadMore;
        this.paint();
    }
    /**
     * 滚动加载更多列表数据
     */
    public getMoreList() {
        const h1 = document.getElementById('historylist').offsetHeight; 
        const h2 = document.getElementById('history').offsetHeight; 
        const scrollTop = document.getElementById('historylist').scrollTop; 
        if (this.state.hasMore && this.state.refresh && (h2 - h1 - scrollTop) < 20) {
            this.state.refresh = false;
            console.log('加载中，请稍后~~~');
            setTimeout(() => {
                this.loadMore();
                this.state.refresh = true;
            }, 1000);
        } 
    }
}

register('miningHistory', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.loadMore();
    }
});