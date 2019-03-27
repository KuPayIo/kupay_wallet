/**
 * 入账
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getModulConfig } from '../../../modulConfig';
import { getAccountDetail } from '../../../net/pull';
import { CloudCurrencyType } from '../../../store/interface';
import { getStore, register } from '../../../store/memstore';
import { timestampFormat } from '../../../utils/tools';
// ===================================================== 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface Props {
    currencyName:string;
    isActive:boolean;
}
export class AccountEntry extends Widget {
    public props:any;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init() {
        const allLogs = getStore('cloud/cloudWallets').get(CloudCurrencyType[this.props.currencyName]);
        console.log('allLogs',allLogs);
        this.props = {
            ...this.props,
            recordList:this.parseRecordList(allLogs.rechargeLogs.list),
            nextStart:allLogs.otherLogs.start,
            canLoadMore:allLogs.otherLogs.canLoadMore,
            isRefreshing:false
        };
        this.loadMore();
    }
    /**
     * 更新props数据
     */
    public updateRecordList() {
        if (!this.props) return;
        const allLogs = getStore('cloud/cloudWallets').get(CloudCurrencyType[this.props.currencyName]);
        this.props.nextStart = allLogs.otherLogs.start;
        this.props.canLoadMore = allLogs.otherLogs.canLoadMore;
        this.props.recordList = this.parseRecordList(allLogs.rechargeLogs.list);
        this.props.isRefreshing = false;
        this.paint();
    }

    // tslint:disable-next-line:typedef
    /**
     * 处理充值列表
     * @param list 充值列表 
     */
    public parseRecordList(list:any) {
        const scShow = getModulConfig('SC_SHOW');
        list.forEach((item) => {
            item.amountShow = `+${item.amount} ${scShow}`;
            item.timeShow = timestampFormat(item.time).slice(5);
            item.iconShow = item.behaviorIcon;
        });

        return list;
    }

    public loadMore() {
        getAccountDetail(this.props.currencyName,0,this.props.nextStart);
    }
    public getMoreList() {
        const h1 = document.getElementById('recharge-scroller-container').offsetHeight; 
        const h2 = document.getElementById('recharge-content-container').offsetHeight; 
        const scrollTop = document.getElementById('recharge-scroller-container').scrollTop; 
        if (this.props.canLoadMore && !this.props.isRefreshing && (h2 - h1 - scrollTop) < 20) {
            this.props.isRefreshing = true;
            this.paint();
            console.log('加载中，请稍后~~~');
            this.loadMore();
        } 
    }
    public recordListItemClick(e:any,index:number) {
        if (this.props.recordList[index].oid) {
            popNew('app-view-wallet-cloudWalletSC-transactionDetails',{ oid:this.props.recordList[index].oid });
        }
    }
}

register('cloud/cloudWallets', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateRecordList();
    }
});
