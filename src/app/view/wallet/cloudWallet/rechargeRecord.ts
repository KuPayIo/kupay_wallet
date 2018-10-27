/**
 * other record
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getRechargeLogs } from '../../../net/pull';
import { CurrencyType } from '../../../store/interface';
import { getBorn, register } from '../../../store/memstore';
import { getLanguage, parseStatusShow, timestampFormat } from '../../../utils/tools';
import { fetchLocalTxByHash1 } from '../../../utils/walletTools';
// ===================================================== 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface Props {
    currencyName:string;
    isActive:boolean;
}
export class RechargeRecord extends Widget {
    public props:Props;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
        if (this.props.isActive) {
            getRechargeLogs(this.props.currencyName);
        }
    }
    public init() {
        const rechargeLogs = getBorn('rechargeLogs').get(CurrencyType[this.props.currencyName]) || { list:[],start:0,canLoadMore:false };
        this.state = {
            recordList:[],
            nextStart:rechargeLogs.start,
            canLoadMore:rechargeLogs.canLoadMore,
            isRefreshing:false,
            cfgData:getLanguage(this)
        };
        this.state.recordList = this.parseRecordList(rechargeLogs.list);
    }
    public updateRecordList() {
        if (!this.state) return;
        const rechargeLogs = getBorn('rechargeLogs').get(CurrencyType[this.props.currencyName]) || { list:[],start:0,canLoadMore:false };
        console.log(rechargeLogs);
        const list = rechargeLogs.list;
        this.state.nextStart = rechargeLogs.start;
        this.state.canLoadMore = rechargeLogs.canLoadMore;
        this.state.recordList = this.parseRecordList(list);
        this.state.isRefreshing = false;
        this.paint();
    }
    // tslint:disable-next-line:typedef
    public parseRecordList(list) {
        list.forEach((item) => {
            const txDetail = fetchLocalTxByHash1(item.hash);
            const obj = parseStatusShow(txDetail);
            console.log(txDetail);
            item.statusShow = obj.text;
            item.behavior = this.state.cfgData.recharge;
            item.amountShow = `+${item.amount}`;
            item.timeShow = timestampFormat(item.time).slice(5);
            item.iconShow = `cloud_charge_icon.png`;
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
        getRechargeLogs(this.props.currencyName,this.state.nextStart);
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
    public recordListItemClick(e:any,index:number) {
        popNew('app-view-wallet-transaction-transactionDetails',{ hash:this.state.recordList[index].hash });
    }
}

register('rechargeLogs', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateRecordList();
    }
});

// 本地交易变化,更新状态
register('transactions',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateTransaction();
    }
});