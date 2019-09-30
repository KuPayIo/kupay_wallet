/**
 * RedEnvHistory
 */
import { ShareType } from '../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../pi/ui/root';
import { getLang } from '../../../pi/util/lang';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { sharePerUrl } from '../../config';
import { getInviteCode, querySendRedEnvelopeRecord } from '../../net/pull';
import { PAGELIMIT } from '../../public/config';
import { LuckyMoneyType } from '../../public/interface';
import { getStore, register } from '../../store/memstore';
import { getUserInfo } from '../../utils/pureUtils';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface Props {
    recordList:any[];
    start:string; // 下一次从服务器获取记录时的start
    refresh:boolean; // 是否可以请求更多数据
    hasMore:boolean; // 是否还有更多记录
    showMoreTips:boolean; // 是否显示底部加载更多提示
    sendNumber:number; // 总发出红包个数
    scrollHeight:number;// 页面上滑的高度
    topRefresh:boolean; // 头部刷新按钮
}

export class RedEnvHistory extends Widget {
    public ok: () => void;
    public language:any;
    public state:Props;

    public async create() {
        super.create();
        this.language = this.config.value[getLang()];
        this.props = {
            recordList:[
            ],
            start:undefined,
            refresh:true,
            hasMore:false, 
            showMoreTips:true, 
            sendNumber:0,  
            scrollHeight:0,
            topRefresh:false,
            avatar:''
        };
        
        getUserInfo().then(userInfo => {
            this.props.avatar = userInfo.avatar;
            this.paint();
        });
        this.initData();
    }

    /**
     * 更新数据
     */
    public async initData() {
        const sHisRec = await getStore('activity/luckyMoney/sends');
        if (sHisRec) {
            const hList = sHisRec.list;
            if (hList && hList.length > this.props.recordList.length) {
                console.log('load more from local');
                  
            } else {
                console.log('load more from server');
                querySendRedEnvelopeRecord(this.props.start);
            }
        } else {
            console.log('load more from server');
            querySendRedEnvelopeRecord(this.props.start);
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
        const sHisRec = await getStore('activity/luckyMoney/sends');
        if (!sHisRec) return;
        const hList = sHisRec.list;
        const start = this.props.recordList.length;

        this.props.recordList = this.props.recordList.concat(hList.slice(start,start + PAGELIMIT));
        this.props.sendNumber = sHisRec.sendNumber;
        this.props.start = sHisRec.start;
        this.props.hasMore = this.props.sendNumber > this.props.recordList.length;
        this.props.showMoreTips = this.props.sendNumber >= PAGELIMIT;
        this.initRedEn();
    }

    /**
     * 更新红包已领取数量
     */
    public initRedEn() {
        for (const i in this.props.recordList) {
            this.props.recordList[i].outDate = Number(this.props.recordList[i].time) + (60 * 60 * 24 * 1000) < new Date().getTime();
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
        this.props.scrollHeight = scrollTop;
        if (this.props.hasMore && this.props.refresh && (h2 - h1 - scrollTop) < 20) {
            this.props.refresh = false;
            setTimeout(() => {
                this.loadMore();
                this.props.refresh = true;
            }, 500); 
        } 
        this.paint();
        
    }

    /**
     * 查看详情
     */
    public goDetail(ind:number) {
        popNew('app-view-redEnvelope-redEnvDetail',this.props.recordList[ind]);
    }

    /**
     * 刷新页面
     */
    public refreshPage() {
        this.props.topRefresh = true;
        this.paint();
        setTimeout(() => {
            this.props.topRefresh = false;
            this.paint();
        }, 1000);
        querySendRedEnvelopeRecord('');
    }

    /**
     * 继续发送红包
     */
    public async continueSendClick(index:number) {
        const item = this.props.recordList[index];
        item.message = '恭喜发财 万事如意';
        console.log(item);
        let url = '';
        let title = '';
        const lanSet = await getStore('setting/language');
        let lan:any;
        if (lanSet) {
            lan = lanSet;
        } else {
            lan = 'zh_Hans';
        }
        
        if (item.rtype === 0) {
            // tslint:disable-next-line:max-line-length
            url = `${sharePerUrl}?type=${LuckyMoneyType.Normal}&rid=${item.rid}&lm=${(<any>window).encodeURIComponent(item.message)}&lan=${lan}`;
            title = this.language.redEnvType[0]; 
        } else if (item.rtype === 1) {
            // tslint:disable-next-line:max-line-length
            url = `${sharePerUrl}?type=${LuckyMoneyType.Random}&rid=${item.rid}&lm=${(<any>window).encodeURIComponent(item.message)}&lan=${lan}`;
            title = this.language.redEnvType[1]; 
        } else if (item.rid === '-1') {
            const inviteCodeInfo = await getInviteCode();
            if (inviteCodeInfo.result !== 1) return;
                
            url = `${sharePerUrl}?cid=${inviteCodeInfo.cid}&type=${LuckyMoneyType.Invite}&lan=${lan}`;
            title = this.language.redEnvType[2];
        }
        popNew('app-components-share-share', { 
            shareType: ShareType.TYPE_LINK,
            url,
            title,
            content:item.message
        });
        console.error(url);
    }
}
// =====================================本地
register('activity/luckyMoney/sends', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.loadMore();
    }
});
