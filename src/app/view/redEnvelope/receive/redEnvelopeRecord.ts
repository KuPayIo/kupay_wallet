/**
 * red-envelope record
 */
// ============================== 导入
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getData, queryConvertLog } from '../../../net/pull';
import { CurrencyType, CurrencyTypeReverse } from '../../../store/conMgr';
import { CRecDetail } from '../../../store/interface';
import { find, updateStore } from '../../../store/store';
import { recordNumber } from '../../../utils/constants';
import { getFirstEthAddr, getLocalStorage, 
    setLocalStorage, smallUnit2LargeUnitString, timestampFormat } from '../../../utils/tools';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

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
            showMoreTips:false, // 是否显示底部加载更多提示
            inviteObj:<CRecDetail>null// 邀请红包对象
        };
        this.loadMore();
        this.getInviteRedEnvelope();
    }
    // 获取邀请红包记录
    public async getInviteRedEnvelope() {
        const firstEthAddr = getFirstEthAddr();
        const inviteRedEnvelope = find('inviteRedBag') || {};
        const inviteObj = inviteRedEnvelope[firstEthAddr];
        if (inviteObj) {
            this.state.inviteObj = inviteObj;
            this.innerPaint();

            return;
        }
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
            inviteRedEnvelope[firstEthAddr] = this.state.inviteObj;
            updateStore('inviteRedBag',inviteRedEnvelope);
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
        rList.push(this.state.inviteObj);
        rList.sort((i1,i2) => {
            return i2.time - i1.time;
        });
        this.state.recordListShow = rList;
        this.paint();
    }
    public backPrePage() {
        this.ok && this.ok();
    }

    public loadMore() {
        const firstEthAddr = getFirstEthAddr();
        const historyRecord = find('cHisRec');
        const curHistoryRecord = historyRecord && historyRecord[firstEthAddr];
        if (curHistoryRecord) {
            const hList = curHistoryRecord.list;
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
        const firstEthAddr = getFirstEthAddr();
        const historyRecord = find('cHisRec');
        const curHistoryRecord = historyRecord[firstEthAddr];
        const hList = curHistoryRecord.list;
        const start = this.state.recordList.length;

        this.state.recordList = this.state.recordList.concat(hList.slice(start,start + recordNumber));
        this.state.convertNumber = curHistoryRecord.convertNumber;
        this.state.start = curHistoryRecord.start;
        this.state.hasMore = this.state.convertNumber > this.state.recordList.length;
        this.state.showMoreTips = this.state.convertNumber >= recordNumber;
        this.innerPaint();
    }
    // 向服务器请求更多记录
    public async loadMoreFromServer(start?:string) {
        console.log('load more from server');
        const value = await queryConvertLog(start);
        if (!value) return;
        const firstEthAddr = getFirstEthAddr();
        const historyRecord = find('cHisRec');
        const rList:CRecDetail[] = (historyRecord[firstEthAddr] && historyRecord[firstEthAddr].list) || [];
        const convertNumber = value[0];
        const startNext = value[1];
        const recordList:CRecDetail[] = [];
        const r = value[2];
        for (let i = 0; i < r.length;i++) {
            const currencyName = CurrencyTypeReverse[r[i][3]];
            const record: CRecDetail = {
                suid: r[i][0],
                rid: r[i][1],
                rtype: r[i][2],
                rtypeShow: parseRtype(r[i][2]),
                ctype: r[i][3],
                ctypeShow:currencyName,
                amount: smallUnit2LargeUnitString(currencyName, r[i][4]),
                time: r[i][5],
                timeShow: timestampFormat(r[i][5])
            };
            recordList.push(record);
        }
        this.state.convertNumber = convertNumber;
        this.state.recordList = this.state.recordList.concat(recordList);
        this.state.start = startNext;
        this.state.hasMore = convertNumber > this.state.recordList.length;
        this.state.showMoreTips = convertNumber >= recordNumber;
        historyRecord[firstEthAddr] = {
            start:startNext,
            convertNumber,
            list:rList.concat(recordList)
        };
        if (convertNumber > 0) {
            updateStore('cHisRec',historyRecord);
        }
       
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