/**
 * 领分红  
 * 
 */
// ============================== 导入
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getModulConfig } from '../../../modulConfig';
import { getDividend, getDividHistory, getMining } from '../../../net/pull';
import { CloudCurrencyType } from '../../../store/interface';
import { getCloudBalances, getStore, register } from '../../../store/memstore';
import { PAGELIMIT } from '../../../utils/constants';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class Dividend extends Widget {
    public ok: () => void;
    public language:any;
    constructor() {
        super();
    }

    public create() {
        super.create();
        this.language = this.config.value[getLang()];
        this.props = {
            KTShow:getModulConfig('KT_SHOW'),
            totalDivid:0,
            totalDays:0,
            topRefresh:false,// 顶部手动刷新
            thisDivid:0,
            yearIncome: 0,
            scrollHeight:0,  // 页面滚动高度
            doMining:false,  // 点击领分红，数字动画效果执行
            firstClick:true,
            isAbleBtn:false,  // 点击领分红，按钮动画效果执行
            miningNum:` <div class="miningNum" style="animation:{{it1.doMining?'move 1s':''}}">
                <span>+{{it1.thisNum}}</span>
            </div>`,
            scroll:false,
            data:[  // 分红历史记录
                // { num:0.02,time:'04-30  14:32:00' },
                // { num:0.02,time:'04-30  14:32:00' },
                // { num:0.02,time:'04-30  14:32:00' }
            ],
            ktBalance:getCloudBalances().get(CloudCurrencyType.KT),  // KT持有量 
            hasMore:false,
            refresh:true,
            start:''
            
        };

        this.initData();
        this.initEvent();
        
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    /**
     * 查看分红说明
     */
    public goDetail() {
        popNew('app-view-earn-mining-dividendDetail');
    }

    /**
     * 获取更新数据
     */
    public initData() {
        const data = getStore('activity/dividend/total');
        if (data) {
            this.props.totalDivid = data.totalDivid;
            this.props.totalDays = data.totalDays;
            this.props.thisDivid = data.thisDivid;
            this.props.yearIncome = Number(data.yearIncome) === 0 ? this.language.noneYearIncome :data.yearIncome;
        }

        const history = getStore('activity/dividend/history');  
        if (history) {
            const hList = history.list;
            if (hList && hList.length > this.props.data.length) {
                console.log('load more from local');
                  
            } else {
                console.log('load more from server');
                getDividHistory(this.props.start);
            }
        } else {
            console.log('load more from server');
            getDividHistory(this.props.start);
        }

        this.loadMore();
        this.paint();
    }
    /**
     *  本地实际加载数据
     */
    public async loadMore() {
        const data = getStore('activity/dividend/history');  
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
    public getMoreList(e:any) {
        const h1 = document.getElementById('historylist').offsetHeight; 
        const h2 = document.getElementById('history').offsetHeight; 
        const scrollTop = e.target.scrollTop;
        this.props.scrollHeight = scrollTop; 
        if (this.props.hasMore && this.props.refresh && (h2 - h1 - scrollTop) < 20) {
            this.props.refresh = false;
            console.log('加载中，请稍后~~~');
            setTimeout(() => {
                this.loadMore();
                this.props.refresh = true;
            }, 1000);
        } 

        if (scrollTop > 0) {
            this.props.scroll = true;
            if (this.props.scroll) {
                this.paint();
            }

        } else {
            this.props.scroll = false;
            this.paint();
        }
    }

    /**
     * 点击领分红
     */
    public async doMining() {
        if (this.props.thisDivid > 0 && this.props.firstClick) { // 如果本次可挖大于0并且是首次点击，则需要真正的领分红操作并刷新数据
            // await getAward();  // 领分红
            this.props.firstClick = false;

            setTimeout(() => {// 数字动画效果执行完后刷新页面
                getMining();
                this.initEvent();
                this.paint();
            },500);

        } else {  // 添加一个新的数字动画效果并移除旧的
            const child = document.createElement('div');
            child.setAttribute('class','dividendNum');
            child.setAttribute('style','animation:dividendMove 0.5s');
            // tslint:disable-next-line:no-inner-html
            child.innerHTML = '<span>+0</span>';
            document.getElementsByClassName('dividendNum').item(0).remove();
            document.getElementById('dividendBtn').appendChild(child);
            
        }
        this.props.doMining = true;        
        this.props.isAbleBtn = true;
        this.paint();

        setTimeout(() => {// 按钮动画效果执行完后将领分红状态改为未点击状态，则可以再次点击
            this.props.isAbleBtn = false;
            this.paint();
        },100);
    }

    /**
     * 刷新页面
     */
    public refreshPage() {
        this.props.topRefresh = true;
        this.paint();
        setTimeout(() => {
            this.props.topRefresh = false;
            this.paint();
        }, 1000);
        this.initEvent();
    }

    /**
     * 初始化事件
     */
    private initEvent() {
        // 这里发起通信
        getDividend();
        getDividHistory();
    }
}

// ===================================================== 本地
// ===================================================== 立即执行
register('activity/dividend/total', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});
register('activity/dividend/history', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.loadMore();
    }
});
