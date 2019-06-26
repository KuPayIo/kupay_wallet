/**
 * other record
 */
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { getRealNode } from '../../../../pi/widget/painter';
import { Widget } from '../../../../pi/widget/widget';
import { callGetAccountDetail, callGetRechargeLogs, callGetWithdrawLogs,getStoreData } from '../../../middleLayer/wrap';
import { CloudCurrencyType, CurrencyRecord } from '../../../publicLib/interface';
import { timestampFormat } from '../../../publicLib/tools';
import { fetchLocalTxByHash1, parseStatusShow } from '../../../utils/tools';
import { registerStoreData } from '../../../viewLogic/common';
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
            callGetAccountDetail(this.props.currencyName,1);
            callGetWithdrawLogs(this.props.currencyName);
            callGetRechargeLogs(this.props.currencyName);
        }
        this.updateRecordList();
    }

    /**
     * 更新交易列表
     */
    public updateRecordList() {
        if (!this.props.currencyName) return;
        getStoreData('cloud/cloudWallets').then(cloudWallets => {
            const data1 = cloudWallets.get(CloudCurrencyType[this.props.currencyName]).rechargeLogs;
            this.props.rechargeNext = data1.start;
            this.parseRechargeList(data1.list);
    
            const data2 = cloudWallets.get(CloudCurrencyType[this.props.currencyName]).otherLogs;
            this.props.otherNext = data2.start;
            this.props.otherList = this.parseOtherList(data2.list);
            const data3 = cloudWallets.get(CloudCurrencyType[this.props.currencyName]).withdrawLogs;
            this.props.withdrawNext = data3.start;
            this.parseWithdrawList(data3.list);
    
            this.props.canLoadMore = data1.canLoadMore | data2.canLoadMore | data3.canLoadMore;
            this.props.isRefreshing = false;
            this.paint();
        });
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
        getStoreData('wallet/currencyRecords').then((currencyRecords:CurrencyRecord[]) => {
            const withdraw = { zh_Hans:'提币',zh_Hant:'提幣',en:'' };
            list.forEach((item) => {
                const txDetail = fetchLocalTxByHash1(currencyRecords,item.hash);
                const obj = parseStatusShow(txDetail);
                item.statusShow = obj.text;
                item.behavior = withdraw[getLang()];
                item.amountShow = `-${item.amount}`;
                item.timeShow = timestampFormat(item.time).slice(5);
                item.iconShow = `cloud_withdraw_icon.png`;
            });
            this.props.withdrawList = list;
            this.props.recordList = this.props.rechargeList.concat(this.props.withdrawList);
            this.props.recordList.sort((v1,v2) => {
                return v2.time - v1.time;
            });
            this.paint();
        });
    }
    /**
     * 解析充值记录
     */
    public parseRechargeList(list:any[]) {
        getStoreData('wallet/currencyRecords').then((currencyRecords:CurrencyRecord[]) => {
            const recharge = { zh_Hans:'充值',zh_Hant:'充值',en:'' };
            list.forEach((item) => {
                const txDetail =  fetchLocalTxByHash1(currencyRecords,item.hash);
                const obj = parseStatusShow(txDetail);
                item.statusShow = obj.text;
                item.behavior = recharge[getLang()];
                item.amountShow = `+${item.amount}`;
                item.timeShow = timestampFormat(item.time).slice(5);
                item.iconShow = `cloud_charge_icon.png`;
            });
            this.props.rechargeList = list;
            this.props.recordList = this.props.rechargeList.concat(this.props.withdrawList);
            this.props.recordList.sort((v1,v2) => {
                return v2.time - v1.time;
            });
            this.paint();
        });
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
        callGetAccountDetail(this.props.currencyName,0,this.props.otherNext);
        callGetWithdrawLogs(this.props.currencyName,this.props.withdrawNext);
        callGetRechargeLogs(this.props.currencyName,this.props.rechargeNext);
    }

    /**
     * 加载更多数据
     */
    public getMoreList() {
        const h1 = getRealNode((<any>this.tree).children[0]).offsetHeight; 
        const h2 = getRealNode((<any>this.tree).children[0].children[0]).offsetHeight; 
        const scrollTop = getRealNode((<any>this.tree).children[0]).scrollTop; 
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
        getStoreData('wallet/currencyRecords').then((currencyRecords:CurrencyRecord[]) => {
            const list = this.props.rechargeList.concat(this.props.withdrawList);
            list.forEach((item) => {
                const txDetail = fetchLocalTxByHash1(currencyRecords,item.hash);
                const obj = parseStatusShow(txDetail);
                item.statusShow = obj.text;
            });
            this.props.recordList = list;
            this.paint();
        });
        
    }
}

// 云端记录变化
registerStoreData('cloud/cloudWallets', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateRecordList();
    }
});

// 本地交易变化,更新状态
registerStoreData('wallet/currencyRecords',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateTransaction();
    }
});