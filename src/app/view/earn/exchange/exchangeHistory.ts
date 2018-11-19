/**
 * ExchangeHistory
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getData, getUserList, queryConvertLog } from '../../../net/pull';
import { CloudCurrencyType } from '../../../store/interface';
import { getStore, register, setStore } from '../../../store/memstore';
import { PAGELIMIT } from '../../../utils/constants';
import { parseRtype, timestampFormat } from '../../../utils/tools';
import { getLang } from '../../../../pi/util/lang';
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
    scrollHeight:number;  // 页面滑动高度
    inviteObj:any; // 邀请红包对象
    userList:any[]; // 用户信息列表
    topRefresh:boolean; // 头部刷新按钮
}

export class ExchangeHistory extends Widget {
    public ok: () => void;
    public state:State;
    public language:any;

    public async create() {
        super.create();
        this.language = this.config.value[getLang()];
        this.state = {
            recordList:[
                // { rid:111,rtype:'00',rtypeShow:'拼手气红包',ctypeShow:'ETH',timeShow:'04-30 14:32:00',amount:1 },       
                // { rid:111,rtype:'00',rtypeShow:'普通红包',ctypeShow:'KT',timeShow:'04-30 14:32:00',amount:1 },
                // { rid:111,rtype:'00',rtypeShow:'拼手气红包',ctypeShow:'ETH',timeShow:'04-30 14:32:00',amount:1 }                
            ],
            recordListShow:[],
            convertNumber:0,
            convertNumberShow:0,
            start:undefined,
            topRefresh:false,
            refresh:true,
            hasMore:false, 
            showMoreTips:false, 
            inviteObj:null,
            userList:[],
            scrollHeight:0
        };
        this.initData();
        
    }

    /**
     * 更新数据
     */
    public initData() {
       
        this.getInviteRedEnvelope();     
                               
        const cHisRec = getStore('activity/luckyMoney/exchange');
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
            const data = await getUserList([this.state.recordList[i].suid]);
            this.state.recordList[i].userName = data ? data.nickName :this.language.defaultName;
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
        const inviteRedBagRec = getStore('activity/luckyMoney/invite');
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
                rid: '-1',
                rtype: '99',
                rtypeShow: parseRtype(99),
                ctype: CloudCurrencyType.ETH,
                ctypeShow: 'ETH',
                amount: 0.15,
                time: data.value,
                timeShow: timestampFormat(data.value),
                userName:this.language.inviteRedEnv
            };
            setStore('activity/luckyMoney/invite',this.state.inviteObj);
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
    public async loadMore() {
        const cHisRec = getStore('activity/luckyMoney/exchange');
        if (!cHisRec) return;
        const hList = cHisRec.list;
        const start = this.state.recordList.length;

        this.state.recordList = this.state.recordList.concat(hList.slice(start,start + PAGELIMIT));
        this.state.convertNumber = cHisRec.convertNumber;
        this.state.start = cHisRec.start;
        this.state.hasMore = this.state.convertNumber > this.state.recordList.length;
        this.state.showMoreTips = this.state.convertNumber >= PAGELIMIT;
        await this.initRedEnv();        
        this.innerPaint();
    }

    /**
     * 页面滑动，加载更多数据
     */
    public getMoreList() {
        const oh1 = document.getElementById('exchangeHistoryContent').offsetHeight;
        const oh2 = document.getElementById('exchangeHistoryRecords').offsetHeight;
        const scrollTop = document.getElementById('exchangeHistoryContent').scrollTop; 
        this.state.scrollHeight = scrollTop;
        if (this.state.hasMore && this.state.refresh && (oh2 - oh1 - scrollTop) < 20) {
            this.state.refresh = false;
            console.log(this.language.loading);
            setTimeout(() => {
                this.initData();
                this.state.refresh = true;
            }, 500); 
        } 

        this.paint();
    }

    /**
     * 页面刷新
     */
    public refreshPage() {
        queryConvertLog();
        this.state.topRefresh = true;
        this.paint();
        setTimeout(() => {
            this.state.topRefresh = false;
            this.paint();
        }, 1000);
    }
}
// =====================================本地
register('activity/luckyMoney/exchange', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.loadMore();
    }
});