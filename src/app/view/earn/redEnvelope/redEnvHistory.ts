/**
 * RedEnvHistory
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getInviteCodeDetail, queryDetailLog, querySendRedEnvelopeRecord } from '../../../net/pull';
import { getStore, register } from '../../../store/memstore';
import { PAGELIMIT } from '../../../utils/constants';
import { getLanguage } from '../../../utils/tools';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface State {
    recordList:any[];
    start:string; // 下一次从服务器获取记录时的start
    refresh:boolean; // 是否可以请求更多数据
    hasMore:boolean; // 是否还有更多记录
    showMoreTips:boolean; // 是否显示底部加载更多提示
    sendNumber:number; // 总发出红包个数
    isScroll:boolean; // 是否滑动页面
    rtypeShow:string[]; // 红包类型
    cfgData:any;
}

export class RedEnvHistory extends Widget {
    public ok: () => void;
    public state:State;

    public async create() {
        super.create();
        const cfg = getLanguage(this);
        this.state = {
            recordList:[
                // { rid:'1111',rtype:0,ctypeShow:'KT',timeShow:'04-30 14:32:00',amount:1 },
                // { rid:'1111',rtype:0,ctypeShow:'KT',timeShow:'04-30 14:32:00',amount:1 },
                // { rid:'1111',rtype:0,ctypeShow:'KT',timeShow:'04-30 14:32:00',amount:1 }               
            ],
            start:undefined,
            refresh:true,
            hasMore:false, 
            showMoreTips:true, 
            sendNumber:0,  
            isScroll:false,
            rtypeShow:cfg.redEnvType,
            cfgData: cfg
        };
        this.initData();
    }

    /**
     * 更新数据
     */
    public async initData() {
        const data = await getInviteCodeDetail(); // 获取邀请红包记录
        if (data) {
            this.state.recordList.push({
                rid:'-1' ,
                rtype:2,
                ctypeShow:'ETH',
                timeShow:'',
                amount:0.5,
                curNum:data[1],
                totalNum:20
            });
        }

        const sHisRec = getStore('sHisRec');
        if (sHisRec) {
            const hList = sHisRec.list;
            if (hList && hList.length > this.state.recordList.length) {
                console.log('load more from local');
                  
            } else {
                console.log('load more from server');
                querySendRedEnvelopeRecord(this.state.start);
            }
        } else {
            console.log('load more from server');
            querySendRedEnvelopeRecord(this.state.start);
        }
        this.loadMore();  
    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }

    // 实际加载数据
    public async loadMore() {
        const sHisRec = getStore('sHisRec');
        if (!sHisRec) return;
        const hList = sHisRec.list;
        const start = this.state.recordList.length;

        this.state.recordList = this.state.recordList.concat(hList.slice(start,start + PAGELIMIT));
        this.state.sendNumber = sHisRec.sendNumber;
        this.state.start = sHisRec.start;
        this.state.hasMore = this.state.sendNumber > this.state.recordList.length;
        this.state.showMoreTips = this.state.sendNumber >= PAGELIMIT;
        this.initRedEn();
    }

    /**
     * 更新红包已领取数量
     */
    public async initRedEn() {
        for (const i in this.state.recordList) {
            this.state.recordList[i].outDate = Number(this.state.recordList[i].time) + (60 * 60 * 24 * 1000) < new Date().getTime();
            const data = await queryDetailLog(getStore('conUid'),this.state.recordList[i].rid);
            if (data) {
                this.state.recordList[i].curNum = data[2];
                this.state.recordList[i].totalNum = data[3];
            } else {
                this.state.recordList[i].curNum = 0;
                this.state.recordList[i].totalNum = 0;
            }
        }
        this.paint();
    }

    /**
     * 页面滑动，加载更多列表
     */
    public getMoreList() {
        const h1 = document.getElementById('redEnvHistory').offsetHeight; 
        const h2 = document.getElementById('historyRecords').offsetHeight; 
        const scrollTop = document.getElementById('redEnvHistory').scrollTop; 
        if (this.state.hasMore && this.state.refresh && (h2 - h1 - scrollTop) < 20) {
            this.state.refresh = false;
            setTimeout(() => {
                this.loadMore();
                this.state.refresh = true;
            }, 500); 
        } 

        if (scrollTop > 0) {
            this.state.isScroll = true;
        } else {
            this.state.isScroll = false;
        }
        this.paint();
        
    }

    /**
     * 查看详情
     */
    public goDetail(ind:number) {
        popNew('app-view-earn-redEnvelope-redEnvDetail',this.state.recordList[ind]);
    }

    /**
     * 刷新页面
     */
    public refreshPage() {
        querySendRedEnvelopeRecord('');
    }
}
// =====================================本地
register('sHisRec', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.loadMore();
    }
});