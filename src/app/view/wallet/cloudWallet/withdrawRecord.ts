/**
 * other record
 */
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getWithdrawLogs } from '../../../net/pull';
import { CloudCurrencyType } from '../../../store/interface';
import { getStore, register } from '../../../store/memstore';
import { getLanguage, parseStatusShow, timestampFormat } from '../../../utils/tools';
import { fetchLocalTxByHash1 } from '../../../utils/walletTools';
import { getLang } from '../../../../pi/util/lang';
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
    public props:Props;
    public language:any;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
        if (this.props.isActive) {
            getWithdrawLogs(this.props.currencyName);
        }
    }
    public init() {
        this.language = this.config.value[getLang()];
        const withdrawLogs = getStore('cloud/cloudWallets').get(CloudCurrencyType[this.props.currencyName]).withdrawLogs;
        this.state = {
            recordList:[],
            nextStart:withdrawLogs.start,
            canLoadMore:withdrawLogs.canLoadMore,
            isRefreshing:false,
        };
        this.state.recordList = this.parseRecordList(withdrawLogs.list);
    }
    public updateRecordList() {
        if (!this.state) return;
        const withdrawLogs = getStore('cloud/cloudWallets').get(CloudCurrencyType[this.props.currencyName]).withdrawLogs;
        const list = withdrawLogs.list;
        this.state.nextStart = withdrawLogs.start;
        this.state.canLoadMore = withdrawLogs.canLoadMore;
        this.state.recordList = this.parseRecordList(list);
        this.state.isRefreshing = false;
        this.paint();
    }

    // tslint:disable-next-line:typedef
    public parseRecordList(list) {
        list.forEach((item) => {
            const txDetail = fetchLocalTxByHash1(item.hash);
            const obj = parseStatusShow(txDetail);
            item.statusShow = obj.text;
            item.behavior = this.language.withdraw;
            item.amountShow = `-${item.amount}`;
            item.timeShow = timestampFormat(item.time).slice(5);
            item.iconShow = `cloud_withdraw_icon.png`;
        });

        return list;
    }
    public updateTransaction() {
        const list = this.state.recordList;
        list.forEach(item => {
            const txDetail = fetchLocalTxByHash1(item.hash);
            const obj = parseStatusShow(txDetail);
            item.statusShow = obj.text;
        });
        this.paint();
    }
    
    public loadMore() {
        getWithdrawLogs(this.props.currencyName,this.state.nextStart);
    }
    public getMoreList() {
        const h1 = document.getElementById('withdraw-scroller-container').offsetHeight; 
        const h2 = document.getElementById('withdraw-content-container').offsetHeight; 
        const scrollTop = document.getElementById('withdraw-scroller-container').scrollTop; 
        if (this.state.canLoadMore && !this.state.isRefreshing && (h2 - h1 - scrollTop) < 20) {
            this.state.isRefreshing = true;
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

// 本地交易变化,更新状态
register('wallet/currencyRecords',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateTransaction();
    }
});