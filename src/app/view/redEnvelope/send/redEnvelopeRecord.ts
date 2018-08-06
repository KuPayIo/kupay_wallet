/**
 * red-envelope record
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { CurrencyTypeReverse, querySendRedEnvelopeRecord } from '../../../store/conMgr';
import { getFirstEthAddr, getLocalStorage, setLocalStorage, smallUnit2LargeUnit, timestampFormat } from '../../../utils/tools';

interface Record {
    rtype:number;// 红包类型
    ctype:number;// 币种
    amount:number;// 金额
    time:number;// 时间
    codes:string[];// 兑换码
}
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
        this.state = {
            sendNumber:0,
            recordList:[]
        };
        this.init();
    }
    public async init() {
        const firstEthAddr = getFirstEthAddr();
        const historyRecord = getLocalStorage('sendRedEnvelopeHistoryRecord');
        if (historyRecord) {
            this.state.sendNumber = historyRecord[firstEthAddr].sendNumber;
            this.state.recordList = historyRecord[firstEthAddr].list;
            this.paint();
        } else {
            this.loadMore();
        }
    }
    public backPrePage() {
        this.ok && this.ok();
    }

    public redEnvelopeItemClick(e:any,index:number) {
        popNew('app-view-redEnvelope-send-redEnvelopeDetails',{ ...this.state.redEnvelopeList[index] });
    }

    // 向服务器请求更多记录
    public async loadMore(start?:string) {
        const firstEthAddr = getFirstEthAddr();
        const historyRecord = getLocalStorage('sendRedEnvelopeHistoryRecord');
        const rList:RecordShow[] = (historyRecord && historyRecord[firstEthAddr].list) || [];
        const res = await querySendRedEnvelopeRecord(start);
        const recordListShow:RecordShow[] = [];
        if (res.result === 1) {
            const sendNumber = res.value[0];
            const start = res.value[1];
            const recordList:Record[] = [];
            const r = res.value[2];
            for (let i = 0; i < r.length;i++) {
                const currencyName = CurrencyTypeReverse[r[i][1]];
                const record:Record = {
                    rtype:r[i][0],
                    ctype:r[i][1],
                    amount:smallUnit2LargeUnit(currencyName,r[i][2]),
                    time:r[i][3],
                    codes:r[i][4]
                };
                recordList.push(record);
                recordListShow.push({ ...record,ctypeShow:currencyName,timeShow:timestampFormat(record.time) });
            }
            this.state.sendNumber = sendNumber;
            this.state.recordList = this.state.recordList.concat(recordListShow);
            const hRecord = {};
            hRecord[firstEthAddr] = {
                start,
                sendNumber,
                list:rList.concat(recordListShow)
            };
            setLocalStorage('sendRedEnvelopeHistoryRecord',hRecord);
            this.paint();
        } else {
            popNew('app-components-message-message',{ itype:'error',content:'出错啦',center:true });
        }
    }
}