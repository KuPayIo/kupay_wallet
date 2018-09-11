/**
 * RedEnvHistory
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { queryDetailLog, querySendRedEnvelopeRecord } from '../../../net/pull';
import { CurrencyTypeReverse, RedBag, SHisRec, SRecDetail } from '../../../store/interface';
import { find, updateStore } from '../../../store/store';
import { PAGELIMIT } from '../../../utils/constants';
import { timestampFormat } from '../../../utils/tools';
import { smallUnit2LargeUnit } from '../../../utils/unitTools';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface State {
    recordList:any[];
    start:string;
    refresh:boolean;
    hasMore:boolean;
    showMoreTips:boolean;
    sendNumber:number;
    isScroll:boolean;
}

export class RedEnvHistory extends Widget {
    public ok: () => void;
    public state:State;

    public create() {
        super.create();
        this.initData();
    }

    public initData() {
        this.state = {
            recordList:[
                { rid:'1111',rtype:0,ctypeShow:'KT',timeShow:'04-30 14:32:00',amount:1 },
                { rid:'1111',rtype:0,ctypeShow:'KT',timeShow:'04-30 14:32:00',amount:1 },
                { rid:'1111',rtype:0,ctypeShow:'KT',timeShow:'04-30 14:32:00',amount:1 },
                { rid:'1111',rtype:0,ctypeShow:'KT',timeShow:'04-30 14:32:00',amount:1 }               
            ],
            start:undefined,// 下一次从服务器获取记录时的start
            refresh:true,// 是否可以请求更多数据
            hasMore:false, // 是否还有更多记录
            showMoreTips:false, // 是否显示底部加载更多提示
            sendNumber:0,  // 总发出红包个数
            isScroll:false // 是否滑动页面
        };
        this.loadMore();
        for (const i in this.state.recordList) {
            this.state.recordList[i].totalNum = 0;
            this.state.recordList[i].curNum = 0;
        }
        this.initRecordList();
        console.log(this.state.recordList.length);
        // this.paint();
    }

    /**
     * 刷新红包历史纪录中的已领取数量
     */
    public async initRecordList() {
        for (const i in this.state.recordList) {            
            const value = await queryDetailLog(this.state.recordList[i].rid);
            if (!value) return;
            const data = value[1];
            this.state.recordList[i].totalNum = data.length;
            let curNum = 0;
            for (const j in data) {
                if (data[j][1] !== 0 && data[j][5] !== 0) {
                    curNum ++;
                }
            }
            this.state.recordList[i].curNum = curNum;
        }
        this.paint();
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    /**
     * 获取数据
     */
    public loadMore() {
        const sHisRec = find('sHisRec');
        if (sHisRec) {
            const hList = sHisRec.list;
            if (hList && hList.length > this.state.recordList.length) {
                this.loadMoreFromLocal();
            } else {
                this.loadMoreFromServer(this.state.start);
            }
        } else {
            this.loadMoreFromServer(this.state.start);
        }
    }

    // 从本地缓存加载更多
    public loadMoreFromLocal() {
        console.log('load more from local');
        const sHisRec = find('sHisRec');
        const hList = sHisRec.list;
        const start = this.state.recordList.length;

        this.state.recordList = this.state.recordList.concat(hList.slice(start,start + PAGELIMIT));
        this.state.sendNumber = sHisRec.sendNumber;
        this.state.start = sHisRec.start;
        this.state.hasMore = this.state.sendNumber > this.state.recordList.length;
        this.state.showMoreTips = this.state.sendNumber >= PAGELIMIT;
        this.paint();
    }

    // 向服务器请求更多记录
    public async loadMoreFromServer(bStart?:string) {
        console.log('load more from server');
        const sHisRec = find('sHisRec');
        const rList:SRecDetail[] = sHisRec && sHisRec.list || [];
        const value = await querySendRedEnvelopeRecord(bStart);
        if (!value) return;
        const sendNumber = value[0];
        const start = value[1];
        const recordList:SRecDetail[] = [];
        const r = value[2];
        for (let i = 0; i < r.length;i++) {
            const currencyName = CurrencyTypeReverse[r[i][2]];
            const record:SRecDetail = {
                rid:r[i][0].toString(),
                rtype:r[i][1],
                ctype:r[i][2],
                ctypeShow:currencyName,
                amount:smallUnit2LargeUnit(currencyName,r[i][3]),
                time:r[i][4],
                timeShow:timestampFormat(r[i][4]),
                codes:r[i][5]
            };
            recordList.push(record);
        }
        this.state.sendNumber = sendNumber;
        this.state.recordList = this.state.recordList.concat(recordList);
        this.state.start = start;
        this.state.hasMore = sendNumber > this.state.recordList.length;
        this.state.showMoreTips = sendNumber >= PAGELIMIT;
        const sHisRecNew:SHisRec = {
            start,
            sendNumber,
            list:rList.concat(recordList)
        };
        if (sendNumber > 0) {
            updateStore('sHisRec',sHisRecNew);
        }
        this.paint();
    }

    /**
     * 页面滑动，加载更多列表
     */
    public getMoreList() {
        const h1 = document.getElementById('content').offsetHeight; 
        const h2 = document.getElementById('records').offsetHeight; 
        const scrollTop = document.getElementById('content').scrollTop; 
        if (this.state.hasMore && this.state.refresh && (h2 - h1 - scrollTop) < 20) {
            this.state.refresh = false;
            console.log('加载中，请稍后~~~');
            setTimeout(() => {
                this.loadMore();
                this.state.refresh = true;
            }, 500); 
        } 

        if (scrollTop > 0) {
            this.state.isScroll = true;
            if (this.state.isScroll) {
                this.paint();
            }
        } else {
            this.state.isScroll = false;
            this.paint();
        }
    }

    /**
     * 
     */
    public goDetail(ind:number) {
        popNew('app-view-earn-redEnvelope-redEnvDetail',this.state.recordList[ind]);
    }
}