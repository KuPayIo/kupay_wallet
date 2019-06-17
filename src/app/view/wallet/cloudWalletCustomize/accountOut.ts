/**
 * other record
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { getRealNode } from '../../../../pi/widget/painter';
import { Widget } from '../../../../pi/widget/widget';
import { getStoreData } from '../../../middleLayer/memBridge';
import { callGetWithdrawLogs } from '../../../middleLayer/netBridge';
import { CloudCurrencyType } from '../../../publicLib/interface';
import { getModulConfig } from '../../../publicLib/modulConfig';
import { currencyType, timestampFormat } from '../../../publicLib/tools';
import { register } from '../../../store/memstore';
// ===================================================== 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface Props {
    currencyName:string;
    isActive:boolean;
}
export class AccountOut extends Widget {
    public props:any;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
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
            const allLogs = cloudWallets.get(CloudCurrencyType[this.props.currencyName]);
            this.props.recordList = this.parseRecordList(allLogs.withdrawLogs.list);
            this.props.nextStart = allLogs.otherLogs.start;
            this.props.canLoadMore = allLogs.otherLogs.canLoadMore;
            this.paint();
        });
    }

    public updateRecordList() {
        if (!this.props.currencyName) return;
        getStoreData('cloud/cloudWallets').then(cloudWallets => {
            const allLogs = cloudWallets.get(CloudCurrencyType[this.props.currencyName]);
            this.props.recordList = this.parseRecordList(allLogs.withdrawLogs.list);
            this.props.nextStart = allLogs.otherLogs.start;
            this.props.canLoadMore = allLogs.otherLogs.canLoadMore;
            this.paint();
        });
        this.props.isRefreshing = false;
    }

    // tslint:disable-next-line:typedef
    public parseRecordList(list) {
        // tslint:disable-next-line:max-line-length
        const titleShow = this.props.currencyName === CloudCurrencyType[CloudCurrencyType.SC] ? getModulConfig('SC_SHOW') : getModulConfig('KT_SHOW');
        list.forEach((item) => {
            item.amountShow = `${item.amount} ${currencyType(titleShow)}`;
            item.timeShow = timestampFormat(item.time).slice(5);
            item.iconShow = item.behaviorIcon;
        });

        return list;
    }

    public loadMore() {
        callGetWithdrawLogs(this.props.currencyName,this.props.nextStart);
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
        const item = this.props.recordList[index];
        if (this.props.currencyName === CloudCurrencyType[CloudCurrencyType.SC] && item.oid) {
            popNew('app-view-wallet-cloudWalletCustomize-transactionDetails',{ 
                oid:item.oid,
                itype:item.itype,
                ctype:item.amount >= 0 ? 1 : 2 
            });
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
