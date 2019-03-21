/**
 * other record
 */
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getAccountDetail, getRechargeLogs, getWithdrawLogs } from '../../../net/pull';
import { CloudCurrencyType } from '../../../store/interface';
import { getStore, register } from '../../../store/memstore';
import { parseStatusShow, timestampFormat } from '../../../utils/tools';
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
    public props:any;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init() {
        this.props = {
            ...this.props,
            recordList:[], // 全部记录
            otherList:[],  // 其他记录
            rechargeList:[], // 充值记录
            withdrawList:[], // 提币记录
            otherNext:0, // 其他下一页标记
            rechargeNext:0, // 充值下一页标记
            withdrawNext:0, // 提币下一页标记
            canLoadMore:false,
            isRefreshing:false
        };
        if (this.props.isActive) {
            getAccountDetail(this.props.currencyName,1);
            getWithdrawLogs(this.props.currencyName);
            getRechargeLogs(this.props.currencyName);
        }
        this.updateRecordList();
    }

    /**
     * 更新交易列表
     */
    public updateRecordList() {
        if (!this.props.currencyName) return;
        const cloudWallets = getStore('cloud/cloudWallets');
        const data1 = cloudWallets.get(CloudCurrencyType[this.props.currencyName]).rechargeLogs;
        this.props.rechargeNext = data1.start;
        this.props.rechargeList = this.parseRechargeList(data1.list);

        const data2 = cloudWallets.get(CloudCurrencyType[this.props.currencyName]).otherLogs;
        this.props.otherNext = data2.start;
        this.props.otherList = this.parseOtherList(data2.list);
        
        const data3 = cloudWallets.get(CloudCurrencyType[this.props.currencyName]).withdrawLogs;
        this.props.withdrawNext = data3.start;
        this.props.withdrawList = this.parseWithdrawList(data3.list);

        this.props.recordList = [].concat(this.props.rechargeList,this.props.otherList,this.props.withdrawList);
        this.props.recordList.sort((v1,v2) => {
            return v2.time - v1.time;
        });
        this.props.canLoadMore = data1.canLoadMore | data2.canLoadMore | data3.canLoadMore;
        this.props.isRefreshing = false;
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
        const withdraw = { zh_Hans:'提币',zh_Hant:'提幣',en:'' };
        list.forEach((item) => {
            const txDetail = fetchLocalTxByHash1(item.hash);
            const obj = parseStatusShow(txDetail);
            item.statusShow = obj.text;
            item.behavior = withdraw[getLang()];
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
        const recharge = { zh_Hans:'充值',zh_Hant:'充值',en:'' };
        list.forEach((item) => {
            const txDetail = fetchLocalTxByHash1(item.hash);
            const obj = parseStatusShow(txDetail);
            item.statusShow = obj.text;
            item.behavior = recharge[getLang()];
            item.amountShow = `+${item.amount}`;
            item.timeShow = timestampFormat(item.time).slice(5);
            item.iconShow = `cloud_charge_icon.png`;
        });

        return list;
    }

    /**
     * 查看详情界面
     */
    public recordListItemClick(e:any,index:number) {
        if (this.props.recordList[index].hash) {
            popNew('app-view-wallet-transaction-transactionDetails',{ hash:this.props.recordList[index].hash });
        }
    }

    /**
     * 请求更多数据
     */
    public loadMore() {
        getAccountDetail(this.props.currencyName,0,this.props.otherNext);
        getWithdrawLogs(this.props.currencyName,this.props.withdrawNext);
        getRechargeLogs(this.props.currencyName,this.props.rechargeNext);
    }

    /**
     * 加载更多数据
     */
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

    /**
     * 更新交易状态
     */
    public updateTransaction() {
        const list = this.props.rechargeList.concat(this.props.withdrawList);
        list.forEach(item => {
            const txDetail = fetchLocalTxByHash1(item.hash);
            const obj = parseStatusShow(txDetail);
            item.statusShow = obj.text;
        });
        this.paint();
    }
}

// 云端记录变化
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