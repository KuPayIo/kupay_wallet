/**
 * other record
 */
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { getRealNode } from '../../../../pi/widget/painter';
import { Widget } from '../../../../pi/widget/widget';
import { callGetRechargeLogs,getStoreData } from '../../../middleLayer/wrap';
import { CloudCurrencyType, CurrencyRecord } from '../../../publicLib/interface';
import { timestampFormat } from '../../../publicLib/tools';
import { register } from '../../../store/memstore';
import { fetchLocalTxByHash1, parseStatusShow } from '../../../utils/tools';
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
    public props:any;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
        if (this.props.isActive) {
            callGetRechargeLogs(this.props.currencyName);
        }
    }
    public init() {
        
        this.props = {
            ...this.props,
            recordList:[],
            nextStart:'',
            canLoadMore:false,
            isRefreshing:false
        };
        getStoreData('cloud/cloudWallets').then(cloudWallets => {
            const rechargeLogs = cloudWallets.get(CloudCurrencyType[this.props.currencyName]).rechargeLogs;
            this.props.nextStart = rechargeLogs.start;
            this.props.canLoadMore = rechargeLogs.canLoadMore;
            this.parseRecordList(rechargeLogs.list);
            this.paint();
        });
        
    }
    public updateRecordList() {
        if (!this.props) return;
        getStoreData('cloud/cloudWallets').then(cloudWallets => {
            const rechargeLogs = cloudWallets.get(CloudCurrencyType[this.props.currencyName]).rechargeLogs;
            this.props.nextStart = rechargeLogs.start;
            this.props.canLoadMore = rechargeLogs.canLoadMore;
            this.parseRecordList(rechargeLogs.list);
            this.paint();
        });
        this.props.isRefreshing = false;
    }

    public parseRecordList(list:any) {
        getStoreData('wallet/currencyRecords').then((currencyRecords:CurrencyRecord[]) => {
            const recharge = { zh_Hans:'充值',zh_Hant:'充值',en:'' };
            list.forEach((item) => {
                const txDetail = fetchLocalTxByHash1(currencyRecords,item.hash);
                const obj = parseStatusShow(txDetail);
                console.log(txDetail);
                item.statusShow = obj.text;
                item.behavior = recharge[getLang()];
                item.amountShow = `+${item.amount}`;
                item.timeShow = timestampFormat(item.time).slice(5);
                item.iconShow = `cloud_charge_icon.png`;
            });
            this.props.recordList = list;
            this.paint();
        });
    }

    public updateTransaction() {
        getStoreData('wallet/currencyRecords').then((currencyRecords:CurrencyRecord[]) => {
            const recharge = { zh_Hans:'充值',zh_Hant:'充值',en:'' };
            const list = this.props.recordList;
            list.forEach((item) => {
                const txDetail = fetchLocalTxByHash1(currencyRecords,item.hash);
                const obj = parseStatusShow(txDetail);
                console.log(txDetail);
                item.statusShow = obj.text;
                item.behavior = recharge[getLang()];
                item.amountShow = `+${item.amount}`;
                item.timeShow = timestampFormat(item.time).slice(5);
                item.iconShow = `cloud_charge_icon.png`;
            });
            this.props.recordList = list;
            this.paint();
        });
    }
    
    public loadMore() {
        callGetRechargeLogs(this.props.currencyName,this.props.nextStart);
    }
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
    public recordListItemClick(e:any,index:number) {
        popNew('app-view-wallet-transaction-transactionDetails',{ hash:this.props.recordList[index].hash });
    }
}

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