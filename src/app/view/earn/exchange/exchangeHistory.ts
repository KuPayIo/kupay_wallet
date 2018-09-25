/**
 * ExchangeHistory
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getData, queryConvertLog, queryDetailLog } from '../../../net/pull';
import { CRecDetail, CurrencyType } from '../../../store/interface';
import { find, register, updateStore } from '../../../store/store';
import { PAGELIMIT } from '../../../utils/constants';
import { parseRtype, timestampFormat } from '../../../utils/tools';
// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface State {
    recordList:any[];
    recordListShow:any[];
    start:string; // 下一次从服务器获取记录时的start
    refresh:boolean; // 是否加载更多数据
    hasMore:boolean; // 是否还有更多记录
    showMoreTips:boolean; // 是否显示底部加载更多提示
    convertNumber:number; // 兑换总数，不包含邀请红包
    convertNumberShow:number; // 兑换总数
    isScroll:boolean;  // 页面是否滑动
    inviteObj:CRecDetail; // 邀请红包对象
    cfgData:any; 
}

export class ExchangeHistory extends Widget {
    public ok: () => void;
    public state:State;

    public async create() {
        super.create();
        this.state = {
            recordList:[
                // { rid:111,rtype:'00',rtypeShow:'拼手气红包',ctypeShow:'ETH',timeShow:'04-30 14:32:00',amount:1 },       
                // { rid:111,rtype:'00',rtypeShow:'普通红包',ctypeShow:'KT',timeShow:'04-30 14:32:00',amount:1 },
                // { rid:111,rtype:'00',rtypeShow:'拼手气红包',ctypeShow:'ETH',timeShow:'04-30 14:32:00',amount:1 }                
            ],
            recordListShow:[],
            convertNumber:0,
            convertNumberShow:0,
            isScroll:false,
            start:undefined,
            refresh:true,
            hasMore:false, 
            showMoreTips:false, 
            inviteObj:null,
            cfgData:this.config.value.simpleChinese
        };
        this.initData();
        
    }

    /**
     * 更新数据
     */
    public initData() {
        const lan = find('languageSet');
        if (lan) {
            this.state.cfgData = this.config.value[lan.languageList[lan.selected]];
        }
        this.getInviteRedEnvelope();     
                               
        const cHisRec = find('cHisRec');
        if (cHisRec) {
            const hList = cHisRec.list;
            if (hList && hList.length > this.state.recordList.length) {
                console.log('load more from local');
            } else {
                console.log('load more from server');
                queryConvertLog(this.state.start);
            }
        } else {
            console.log('load more from server');
            queryConvertLog(this.state.start);
        }
        this.loadMore();    
    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }

    /**
     * 更新红包领取详情
     */
    public async initRedEnv() {
        for (const i in this.state.recordList) {
            const data = await queryDetailLog(this.state.recordList[i].rid);
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
     * 查看详情
     */
    public goDetail(ind:number) {
        popNew('app-view-earn-exchange-exchangeDetail',this.state.recordListShow[ind]);
    }

    // 获取邀请红包记录
    public async getInviteRedEnvelope() {
        const inviteRedBagRec = find('inviteRedBagRec');
        if (inviteRedBagRec) {
            console.log('inviteRedBagRec from local');
            this.state.inviteObj = inviteRedBagRec;
            this.innerPaint();

            return;
        }
        const data = await getData('convertRedEnvelope');
        if (data.value && data.value !== '$nil') {
            this.state.inviteObj = {
                suid: 0,
                rid: -1,
                rtype: 99,
                rtypeShow: parseRtype(99),
                ctype: CurrencyType.ETH,
                ctypeShow: 'ETH',
                amount: 0.15,
                time: data.value,
                timeShow: timestampFormat(data.value)               

            };
            updateStore('inviteRedBagRec',this.state.inviteObj);
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
   
    /**
     * 实际加载数据
     */
    public loadMore() {
        const cHisRec = find('cHisRec');
        if (!cHisRec) return;
        const hList = cHisRec.list;
        const start = this.state.recordList.length;

        this.state.recordList = this.state.recordList.concat(hList.slice(start,start + PAGELIMIT));
        this.state.convertNumber = cHisRec.convertNumber;
        this.state.start = cHisRec.start;
        this.state.hasMore = this.state.convertNumber > this.state.recordList.length;
        this.state.showMoreTips = this.state.convertNumber >= PAGELIMIT;
        this.initRedEnv();        
        this.innerPaint();
    }

    /**
     * 页面滑动，加载更多数据
     */
    public getMoreList() {
        const oh1 = document.getElementById('exchangeHistoryContent').offsetHeight;
        const oh2 = document.getElementById('exchangeHistoryRecords').offsetHeight;
        const scrollTop = document.getElementById('exchangeHistoryContent').scrollTop; 
        if (this.state.hasMore && this.state.refresh && (oh2 - oh1 - scrollTop) < 20) {
            this.state.refresh = false;
            console.log(this.state.cfgData.loading);
            setTimeout(() => {
                this.initData();
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
}
// =====================================本地
register('cHisRec', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.loadMore();
    }
});