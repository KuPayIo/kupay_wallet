/**
 * red-envelope record
 */
import { Widget } from '../../../../pi/widget/widget';
import { CurrencyType, CurrencyTypeReverse, getData, queryConvertLog, recordNumber } from '../../../store/conMgr';
import { showError } from '../../../utils/toolMessages';
import { getFirstEthAddr, getLocalStorage, setLocalStorage, smallUnit2LargeUnit, timestampFormat } from '../../../utils/tools';

interface RecordShow {
    uid: number;// 用户id
    rid: number;// 红包id
    rtype: number;// 红包类型 0-普通红包，1-拼手气红包，99-邀请红包
    rtypeShow:string;
    ctype: number;// 币种
    ctypeShow:string;
    amount: number;// 金额
    time: number;// 时间
    timeShow:string;
}

export class RedEnvelopeRecord extends Widget {
    public ok: () => void;

    public create() {
        super.create();
        
        this.init();
    }
    public async init() {
        this.state = {
            convertNumber: 0,
            convertNumberShow:0,
            recordList: [],
            recordListShow:[],
            start:undefined,// 下一次从服务器获取记录时的start
            refresh:true,// 是否可以刷新
            hasMore:false, // 是否还有更多记录
            inviteObj:null// 邀请红包对象
        };
        this.loadMore();
        // 获取邀请红包是否兑换
        const data = await getData('convertRedEnvelope');
        if (data.value && data.value !== '$nil') {
            this.state.inviteObj = {
                uid: 0,
                rid: 0,
                rtype: 99,
                rtypeShow: parseRtype(99),
                ctype: CurrencyType.ETH,
                ctypeShow: 'ETH',
                amount: 0.15,
                time: data.value,
                timeShow: timestampFormat(data.value)
            };
            this.innerPaint();
        }
    }
    // 每次paint前对邀请红包做处理
    public innerPaint() {
        if (!this.state.inviteObj) {
            this.state.convertNumberShow = this.state.convertNumber;
            this.state.recordListShow = this.state.recordList;
            this.paint();

            return;
        }
        this.state.convertNumberShow = this.state.convertNumber + 1;
        const rList = this.state.recordList.slice(0);
        console.log('rList',rList);
        rList.push(this.state.inviteObj);
        rList.sort((i1,i2) => {
            return i1.time - i2.time;
        });
        this.state.recordListShow = rList;
        this.paint();
    }
    public backPrePage() {
        this.ok && this.ok();
    }

    public loadMore() {
        const firstEthAddr = getFirstEthAddr();
        const historyRecord = getLocalStorage('convertRedEnvelopeHistoryRecord');
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
        const historyRecord = getLocalStorage('convertRedEnvelopeHistoryRecord');
        const curHistoryRecord = historyRecord[firstEthAddr];
        const hList = curHistoryRecord.list;
        const start = this.state.recordList.length;

        this.state.recordList = this.state.recordList.concat(hList.slice(start,start + recordNumber));
        this.state.convertNumber = curHistoryRecord.convertNumber;
        this.state.start = curHistoryRecord.start;
        this.state.hasMore = this.state.convertNumber > this.state.recordList.length;
        this.innerPaint();
    }
    // 向服务器请求更多记录
    public async loadMoreFromServer(start?:string) {
        console.log('load more from server');
        const res = await queryConvertLog(start);
        if (res.result !== 1) {
            showError(res.result);

            return;
        }
        const firstEthAddr = getFirstEthAddr();
        const historyRecord = getLocalStorage('convertRedEnvelopeHistoryRecord');
        const rList:RecordShow[] = (historyRecord && historyRecord[firstEthAddr].list) || [];

        const convertNumber = res.value[0];
        const startNext = res.value[1];
        const recordList:RecordShow[] = [];
        const r = res.value[2];
        for (let i = 0; i < r.length;i++) {
            const currencyName = CurrencyTypeReverse[r[i][3]];
            const record: RecordShow = {
                uid: r[i][0],
                rid: r[i][1],
                rtype: r[i][2],
                rtypeShow: parseRtype(r[i][2]),
                ctype: r[i][3],
                ctypeShow:currencyName,
                amount: smallUnit2LargeUnit(currencyName, r[i][4]),
                time: r[i][5],
                timeShow: timestampFormat(r[i][5])
            };
            recordList.push(record);
        }
        this.state.convertNumber = convertNumber;
        this.state.recordList = this.state.recordList.concat(recordList);
        this.state.start = startNext;
        this.state.hasMore = convertNumber > this.state.recordList.length;
        const hRecord = {};
        hRecord[firstEthAddr] = {
            start:startNext,
            convertNumber,
            list:rList.concat(recordList)
        };
        setLocalStorage('convertRedEnvelopeHistoryRecord',hRecord);
        this.innerPaint();
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

/**
 * 转化rtype
 */
const parseRtype = (rType) => {
    if (rType === 0) return '等额红包';
    if (rType === 1) return '随机红包';
    if (rType === 99) return '邀请红包';

    return '';
};