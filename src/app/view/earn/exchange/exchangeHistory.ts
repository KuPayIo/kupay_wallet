/**
 * ExchangeHistory
 */
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getData, getOneUserInfo, queryConvertLog } from '../../../net/pull';
import { getStore, register, setStore } from '../../../store/memstore';
import { PAGELIMIT } from '../../../utils/constants';
import { getUserInfo, parseRtype, timestampFormat } from '../../../utils/tools';
// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface Props {
    recordList:any[];
    recordListShow:any[];
    start:string; // 下一次从服务器获取记录时的start
    refresh:boolean; // 是否加载更多数据
    hasMore:boolean; // 是否还有更多记录
    showMoreTips:boolean; // 是否显示底部加载更多提示
    convertNumber:number; // 兑换总数，不包含邀请码
    convertNumberShow:number; // 兑换总数
    scrollHeight:number;  // 页面滑动高度
    inviteObj:any; // 邀请码对象
    userList:any[]; // 用户信息列表
    topRefresh:boolean; // 头部刷新按钮
}

export class ExchangeHistory extends Widget {
    public ok: () => void;
    public state:Props;
    public language:any;

    public async create() {
        super.create();
        this.language = this.config.value[getLang()];
        this.props = {
            recordList:[
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
            avatar:getUserInfo().avatar,
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
            if (hList && hList.length > this.props.recordList.length) {
                console.log('load more from local');
            } else {
                console.log('load more from server');
                queryConvertLog(this.props.start);
            }
        } else {
            console.log('load more from server');
            queryConvertLog(this.props.start);
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
        for (const i in this.props.recordList) {
            const data = await getOneUserInfo([this.props.recordList[i].suid]);
            this.props.recordList[i].userName = data ? data.nickName :this.language.defaultName;
        }
        
        this.paint();
    }

    /**
     * 查看详情
     */
    public goDetail(ind:number) {
        popNew('app-view-earn-exchange-exchangeDetail',this.props.recordListShow[ind]);
    }

    // 获取邀请码记录
    public async getInviteRedEnvelope() {
        const inviteRedBagRec = getStore('activity/luckyMoney/invite');
        if (inviteRedBagRec) {
            console.log('inviteRedBagRec from local');
            this.props.inviteObj = inviteRedBagRec;
            this.innerPaint();

            return;
        }
        const data = await getData('convertRedEnvelope');
        if (data.value && data.value !== '$nil') {
            this.props.inviteObj = {
                suid: 0,
                rid: '-1',
                rtype: '99',
                rtypeShow: parseRtype(99),
                ctypeShow: '银锄',
                amount: 1,
                time: data.value,
                timeShow: timestampFormat(data.value),
                userName:this.language.inviteRedEnv
            };
            setStore('activity/luckyMoney/invite',this.props.inviteObj);
            this.innerPaint();
        }
    }

    // 每次paint前对邀请码做处理
    public innerPaint() {
        if (!this.props.inviteObj) {
            this.props.convertNumberShow = this.props.convertNumber;
            this.props.recordListShow = this.props.recordList;
            this.paint();

            return;
        }
        this.props.convertNumberShow = this.props.convertNumber + 1;
        const rList = this.props.recordList.slice(0);
        rList.push(this.props.inviteObj);
        rList.sort((i1,i2) => {
            return i2.time - i1.time;
        });
        this.props.recordListShow = rList;
        this.paint();
    }
   
    /**
     * 实际加载数据
     */
    public async loadMore() {
        const cHisRec = getStore('activity/luckyMoney/exchange');
        if (!cHisRec) return;
        const hList = cHisRec.list;
        const start = this.props.recordList.length;

        this.props.recordList = this.props.recordList.concat(hList.slice(start,start + PAGELIMIT));
        this.props.convertNumber = cHisRec.convertNumber;
        this.props.start = cHisRec.start;
        this.props.hasMore = this.props.convertNumber > this.props.recordList.length;
        this.props.showMoreTips = this.props.convertNumber >= PAGELIMIT;
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
        this.props.scrollHeight = scrollTop;
        if (this.props.hasMore && this.props.refresh && (oh2 - oh1 - scrollTop) < 20) {
            this.props.refresh = false;
            console.log(this.language.loading);
            setTimeout(() => {
                this.initData();
                this.props.refresh = true;
            }, 500); 
        } 

        this.paint();
    }

    /**
     * 页面刷新
     */
    public refreshPage() {
        queryConvertLog();
        this.props.topRefresh = true;
        this.paint();
        setTimeout(() => {
            this.props.topRefresh = false;
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