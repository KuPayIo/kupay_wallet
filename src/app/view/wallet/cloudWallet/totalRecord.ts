/**
 * other record
 */
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getAccountDetail, getRechargeLogs, getWithdrawLogs } from '../../../net/pull';
import { CurrencyType } from '../../../store/interface';
import { getBorn, register } from '../../../store/store';
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

export class TotalRecord extends Widget {
    public props:Props;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init() {
        this.state = {
            recordList:[], // 全部记录
            otherList:[],  // 其他记录
            rechargeList:[], // 充值记录
            withdrawList:[], // 提币记录
            otherNext:0, // 其他下一页标记
            rechargeNext:0, // 充值下一页标记
            withdrawNext:0, // 提币下一页标记
            canLoadMore:false,
            isRefreshing:false,
            cfgData:getLanguage(this)
        };
        if (this.props.isActive) {
            getAccountDetail(this.props.currencyName,1);
            getWithdrawLogs(this.props.currencyName);
            getRechargeLogs(this.state.currencyName);
        }
        this.updateRecordList();
    }

    /**
     * 更新交易列表
     */
    public updateRecordList() {
        if (!this.state) return;
        const data1 = getBorn('rechargeLogs').get(CurrencyType[this.props.currencyName]) || { list:[],start:0,canLoadMore:false };
        this.state.rechargeNext = data1.start;
        this.state.rechargeList = this.parseRechargeList(data1.list);

        const data2 = getBorn('accountDetail').get(CurrencyType[this.props.currencyName]) || { list:[],start:0,canLoadMore:false };
        this.state.otherNext = data2.start;
        this.state.otherList = this.parseOtherList(data2.list);
        
        const data3 = getBorn('withdrawLogs').get(CurrencyType[this.props.currencyName]) || { list:[],start:0,canLoadMore:false };
        this.state.withdrawNext = data3.start;
        this.state.withdrawList = this.parseWithdrawList(data3.list);

        this.state.recordList = this.state.rechargeList.concat(this.state.otherList,this.state.withdrawList);
        this.state.recordList.sort((v1,v2) => {
            return v2.time - v1.time;
        });
        this.state.canLoadMore = data1.canLoadMore | data2.canLoadMore | data3.canLoadMore;
        this.state.isRefreshing = false;
        this.paint();
    }
    /**
     * 解析其他记录
     */
    public parseOtherList(list:any[]) {
        list.forEach((item) => {
            item.amountShow = item.amount >= 0 ? `+${item.amount}` : `${item.amount}`;
            item.timeShow = timestampFormat(item.time).slice(5);
            item.iconShow = `${item.behaviorIcon}`;
        });

        return list;
    }
    /**
     * 解析提币记录
     */
    public parseWithdrawList(list:any[]) {
        list.forEach((item) => {
            const txDetail = fetchLocalTxByHash1(item.hash);
            const obj = parseStatusShow(txDetail);
            item.statusShow = obj.text;
            item.behavior = this.state.cfgData.withdraw;
            item.amountShow = `-${item.amount}`;
            item.timeShow = timestampFormat(item.time).slice(5);
            item.iconShow = `cloud_withdraw_icon.png`;
        });

        return list;
    }
    /**
     * 解析充值记录
     */
    public parseRechargeList(list:any[]) {
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

    /**
     * 请求更多数据
     */
    public loadMore() {
        getAccountDetail(this.props.currencyName,0,this.state.otherNext);
        getWithdrawLogs(this.props.currencyName,this.state.withdrawNext);
        getRechargeLogs(this.props.currencyName,this.state.rechargeNext);
    }

    /**
     * 加载更多数据
     */
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

    /**
     * 更新交易状态
     */
    public updateTransaction() {
        const list = this.state.rechargeList.concat(this.state.withdrawList);
        list.forEach(item => {
            const txDetail = fetchLocalTxByHash1(item.hash);
            const obj = parseStatusShow(txDetail);
            item.statusShow = obj.text;
        });
        this.paint();
    }
}

register('rechargeLogs', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateRecordList();
    }
});
register('accountDetail', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateRecordList();
    }
});
register('withdrawLogs', () => {
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