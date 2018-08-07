/**
 * red-envelope record
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { CurrencyTypeReverse, querySendRedEnvelopeRecord, recordNumber } from '../../../store/conMgr';
import { getFirstEthAddr, getLocalStorage, setLocalStorage, smallUnit2LargeUnit, timestampFormat } from '../../../utils/tools';

interface RecordShow {
    rtype:number;// 红包类型
    ctype:number;// 币种
    ctypeShow:string;
    amount:number;// 金额
    time:number;// 时间
    timeShow:string;
    codes:string[];// 兑换码
}
interface SendRedEnvelopeHistoryRecord {
    start:string;// 下次请求数据时start字段
    sendNumber:number;// 发送红包总数
    list:RecordShow[];// 记录列表
}

export class RedEnvelopeRecord extends Widget {
    public ok:() => void;
    public create() {
        super.create();
        this.init();
    }
    public async init() {
        this.state = {
            sendNumber:0, // 发送红包总数
            recordList:[],// 历史记录
            start:undefined,// 下一次从服务器获取记录时的start
            refresh:true,// 是否可以刷新
            hasMore:false // 是否还有更多记录
        };
        this.loadMore();
    }
    public backPrePage() {
        this.ok && this.ok();
    }

    public redEnvelopeItemClick(e:any,index:number) {
        popNew('app-view-redEnvelope-send-redEnvelopeDetails',{ ...this.state.recordList[index] });
    }

    public loadMore() {
        const firstEthAddr = getFirstEthAddr();
        const historyRecord = getLocalStorage('sendRedEnvelopeHistoryRecord');
        const curHistoryRecord = historyRecord && historyRecord[firstEthAddr];
        if (curHistoryRecord) {
            const hList = curHistoryRecord.list;
            if (hList.length > this.state.recordList.length) {
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
        const firstEthAddr = getFirstEthAddr();
        const historyRecord = getLocalStorage('sendRedEnvelopeHistoryRecord');
        const curHistoryRecord = historyRecord[firstEthAddr];
        const hList = curHistoryRecord.list;
        const start = this.state.recordList.length;

        this.state.recordList = this.state.recordList.concat(hList.slice(start,start + recordNumber));
        this.state.sendNumber = curHistoryRecord.sendNumber;
        this.state.start = curHistoryRecord.start;
        this.state.hasMore = this.state.sendNumber > this.state.recordList.length;
        this.paint();
    }

    // 向服务器请求更多记录
    public async loadMoreFromServer(start?:string) {
        console.log('load more from server');
        const firstEthAddr = getFirstEthAddr();
        const historyRecord = getLocalStorage('sendRedEnvelopeHistoryRecord');
        const rList:RecordShow[] = (historyRecord && historyRecord[firstEthAddr].list) || [];
        const res = await querySendRedEnvelopeRecord(start);
        if (res.result === 1) {
            const sendNumber = res.value[0];
            const start = res.value[1];
            const recordList:RecordShow[] = [];
            const r = res.value[2];
            for (let i = 0; i < r.length;i++) {
                const currencyName = CurrencyTypeReverse[r[i][1]];
                const record:RecordShow = {
                    rtype:r[i][0],
                    ctype:r[i][1],
                    ctypeShow:currencyName,
                    amount:smallUnit2LargeUnit(currencyName,r[i][2]),
                    time:r[i][3],
                    timeShow:timestampFormat(r[i][3]),
                    codes:r[i][4]
                };
                recordList.push(record);
            }
            this.state.sendNumber = sendNumber;
            this.state.recordList = this.state.recordList.concat(recordList);
            this.state.start = start;
            this.state.hasMore = sendNumber > this.state.recordList.length;
            const hRecord = {};
            hRecord[firstEthAddr] = {
                start,
                sendNumber,
                list:rList.concat(recordList)
            };
            setLocalStorage('sendRedEnvelopeHistoryRecord',hRecord);
            this.paint();
        } else {
            popNew('app-components-message-message',{ itype:'error',content:'出错啦',center:true });
        }
    }

    public getMoreList() {
        const oh1 = document.getElementById('records-container').offsetHeight;
        const oh2 = document.getElementById('records').offsetHeight;
        const scrollTop = document.getElementById('records-container').scrollTop; 
        if (this.state.hasMore && this.state.refresh && (oh2 - oh1 - scrollTop) < 20) {
            this.state.refresh = false;
            console.log('加载中，请稍后~~~');
            setTimeout(() => {
                this.loadMore();
                this.state.refresh = true;
            }, 500); 
        } 
    }
}