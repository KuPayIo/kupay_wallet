/**
 * other record
 */
import { Forelet } from '../../../../pi/widget/forelet';
import { getRealNode } from '../../../../pi/widget/painter';
import { Widget } from '../../../../pi/widget/widget';
import { callGetAccountDetail,getStoreData } from '../../../middleLayer/wrap';
import { CloudCurrencyType } from '../../../publicLib/interface';
import { timestampFormat } from '../../../publicLib/tools';
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
export class OtherRecord extends Widget {
    public props:any;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init() {
        if (this.props.isActive) {
            callGetAccountDetail(this.props.currencyName,1);
        }
        this.props = {
            ...this.props,
            recordList:[],
            nextStart:'',
            canLoadMore:false,
            isRefreshing:false
        };
        getStoreData('cloud/cloudWallets').then(cloudWallets => {
            const accountDetail = cloudWallets.get(CloudCurrencyType[this.props.currencyName]).otherLogs;
            this.props.recordList = this.parseRecordList(accountDetail.list);
            this.props.nextStart = accountDetail.start;
            this.props.canLoadMore = accountDetail.canLoadMore;
            this.paint();
        });

    }
    public updateRecordList() {
        if (!this.props) return;
        getStoreData('cloud/cloudWallets').then(cloudWallets => {
            const accountDetail = cloudWallets.get(CloudCurrencyType[this.props.currencyName]).otherLogs;
            this.props.recordList = this.parseRecordList(accountDetail.list);
            this.props.nextStart = accountDetail.start;
            this.props.canLoadMore = accountDetail.canLoadMore;
            this.paint();
        });
        this.props.isRefreshing = false;
    }

    public parseRecordList(list:any) {
        list.forEach((item) => {
            item.amountShow = item.amount >= 0 ? `+${item.amount}` : `${item.amount}`;
            item.timeShow = timestampFormat(item.time).slice(5);
            item.iconShow = `${item.behaviorIcon}`;
        });

        return list;
    }

    public loadMore() {
        callGetAccountDetail(this.props.currencyName,1,this.props.nextStart);
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
}

register('cloud/cloudWallets', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateRecordList();
    }
});