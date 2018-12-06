/**
 * other record
 */
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getWithdrawLogs } from '../../../net/pull';
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
export class WithdrawRecord extends Widget {
    public props:any;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
        if (this.props.isActive) {
            getWithdrawLogs(this.props.currencyName);
        }
    }
    public init() {

        const allLogs = getStore('cloud/cloudWallets').get(CloudCurrencyType[this.props.currencyName]);
        this.props = {
            ...this.props,
            recordList:this.parseRecordList(allLogs.withdrawLogs.list),
            nextStart:allLogs.otherLogs.start,
            canLoadMore:allLogs.otherLogs.canLoadMore,
            isRefreshing:false
        };
    }

    public updateRecordList() {
        if (!this.props.currencyName) return;
        const allLogs = getStore('cloud/cloudWallets').get(CloudCurrencyType[this.props.currencyName]);
        this.props.nextStart = allLogs.otherLogs.start;
        this.props.canLoadMore = allLogs.otherLogs.canLoadMore;
        this.props.recordList = this.parseRecordList(allLogs.withdrawLogs.list);
        this.props.isRefreshing = false;
        this.paint();
    }

    // tslint:disable-next-line:typedef
    public parseRecordList(list) {
        list.forEach((item) => {
            item.amountShow = `-${item.amount} ${this.props.currencyName}`;
            item.timeShow = timestampFormat(item.time).slice(5);
            item.iconShow = item.behaviorIcon;
        });

        return list;
    }

    public loadMore() {
        getWithdrawLogs(this.props.currencyName,this.props.nextStart);
    }
    public getMoreList() {
        const h1 = document.getElementById('withdraw-scroller-container').offsetHeight; 
        const h2 = document.getElementById('withdraw-content-container').offsetHeight; 
        const scrollTop = document.getElementById('withdraw-scroller-container').scrollTop; 
        if (this.props.canLoadMore && !this.props.isRefreshing && (h2 - h1 - scrollTop) < 20) {
            this.props.isRefreshing = true;
            this.paint();
            console.log('加载中，请稍后~~~');
            this.loadMore();
        } 
    }
}

// ====================================

register('cloud/cloudWallets', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateRecordList();
    }
});
