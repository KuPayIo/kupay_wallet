/**
 * 分红领取记录，挖矿记录
 */
// ================================ 导入
import { Forelet } from '../../../../../../pi/widget/forelet';
import { Widget } from '../../../../../../pi/widget/widget';
import { getMiningHistory } from '../../../../../net/pull';
import { getStore, register } from '../../../../../store/memstore';
import { PAGELIMIT } from '../../../../../utils/constants';

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
        this.init();
    }
    
    public init() {
        this.props = {
            data:[],
            hasMore:false,
            start:'',
            refresh:true
        }; 
        this.initData();
    }

    /**
     * 获取更新数据
     */
    public async initData() {
        const data = getStore('activity/mining/history');  
        if (data) {
            const hList = data.list;
            if (hList && hList.length > this.props.data.length) {
                console.log('load more from local');
                  
            } else {
                console.log('load more from server');
                getMiningHistory(this.props.start);
            }
        } else {
            console.log('load more from server');
            getMiningHistory(this.props.start);
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
        const data = getStore('activity/mining/history');  
        if (!data) return;
        const hList = data.list;
        const start = this.props.data.length;
        this.props.data = this.props.data.concat(hList.slice(start,start + PAGELIMIT));
        this.props.start = data.start;
        this.props.hasMore = data.canLoadMore;
        this.paint();
    }
    /**
     * 滚动加载更多列表数据
     */
    public getMoreList() {
        const h1 = document.getElementById('historylist').offsetHeight; 
        const h2 = document.getElementById('history').offsetHeight; 
        const scrollTop = document.getElementById('historylist').scrollTop; 
        if (this.props.hasMore && this.props.refresh && (h2 - h1 - scrollTop) < 20) {
            this.props.refresh = false;
            console.log('加载中，请稍后~~~');
            setTimeout(() => {
                this.loadMore();
                this.props.refresh = true;
            }, 1000);
        } 
    }

    /**
     * 刷新页面
     */
    public refreshPage() {
        this.init();
    }
}

register('activity/mining/history', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.loadMore();
    }
});
