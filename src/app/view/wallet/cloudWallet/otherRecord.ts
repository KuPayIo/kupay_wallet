/**
 * other record
 */
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getAccountDetail } from '../../../net/pull';
import { CloudCurrencyType } from '../../../store/interface';
import { getStore, register } from '../../../store/memstore';
import { getLanguage, timestampFormat } from '../../../utils/tools';
// ===================================================== 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface Props {
    currencyName:string;
    isActive:boolean;
}
export class OtherRecord extends Widget {
    public props:Props;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init() {
        if (this.props.isActive) {
            getAccountDetail(this.props.currencyName,1);
        }
        const accountDetail = getStore('cloud/cloudWallets').get(CloudCurrencyType[this.props.currencyName]).otherLogs;
        this.state = {
            recordList:this.parseRecordList(accountDetail.list),
            nextStart:accountDetail.start,
            canLoadMore:accountDetail.canLoadMore,
            isRefreshing:false,
            cfgData:getLanguage(this)
        };
    }
    public updateRecordList() {
        if (!this.state) return;
        const accountDetail = getStore('cloud/cloudWallets').get(CloudCurrencyType[this.props.currencyName]).otherLogs;
        const list = accountDetail.list;
        this.state.nextStart = accountDetail.start;
        this.state.canLoadMore = accountDetail.canLoadMore;
        this.state.recordList = this.parseRecordList(list);
        this.state.isRefreshing = false;
        this.paint();
    }
    // tslint:disable-next-line:typedef
    public parseRecordList(list) {
        list.forEach((item) => {
            item.amountShow = item.amount >= 0 ? `+${item.amount}` : `${item.amount}`;
            item.timeShow = timestampFormat(item.time).slice(5);
            item.iconShow = `${item.behaviorIcon}`;
        });

        return list;
    }

    public loadMore() {
        getAccountDetail(this.props.currencyName,1,this.state.nextStart);
    }
    public getMoreList() {
        const h1 = document.getElementById('recharge-scroller-container').offsetHeight; 
        const h2 = document.getElementById('recharge-content-container').offsetHeight; 
        const scrollTop = document.getElementById('recharge-scroller-container').scrollTop; 
        if (this.state.canLoadMore && !this.state.isRefreshing && (h2 - h1 - scrollTop) < 20) {
            this.state.isRefreshing = true;
            this.paint();
            console.log('加载中，请稍后~~~');
            this.loadMore();
        } 
    }
}

register('cloud/cloudWallets', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateRecordList();
    }
});