/**
 * red-envelope record
 */
// ============================== 导入
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { querySendRedEnvelopeRecord } from '../../../net/pull';
import { CurrencyTypeReverse, SHisRec, SRecDetail } from '../../../store/interface';
import { find, updateStore } from '../../../store/store';
import { recordNumber } from '../../../utils/constants';
import { smallUnit2LargeUnitString, timestampFormat } from '../../../utils/tools';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

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
            hasMore:false, // 是否还有更多记录
            showMoreTips:false // 是否显示底部加载更多提示
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

        this.state.recordList = this.state.recordList.concat(hList.slice(start,start + recordNumber));
        this.state.sendNumber = sHisRec.sendNumber;
        this.state.start = sHisRec.start;
        this.state.hasMore = this.state.sendNumber > this.state.recordList.length;
        this.state.showMoreTips = this.state.sendNumber >= recordNumber;
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
                amount:smallUnit2LargeUnitString(currencyName,r[i][3]),
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
        this.state.showMoreTips = sendNumber >= recordNumber;
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