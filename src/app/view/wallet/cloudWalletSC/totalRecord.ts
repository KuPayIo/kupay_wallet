/**
 * other record
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getAccountDetail } from '../../../net/pull';
import { CloudCurrencyType } from '../../../store/interface';
import { getStore, register } from '../../../store/memstore';
import { currencyType, parseStatusShow, timestampFormat } from '../../../utils/tools';
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
            canLoadMore:false,
            isRefreshing:false
        };
        if (this.props.isActive) {
            getAccountDetail(this.props.currencyName,1);
        }
        this.updateRecordList();
    }

    /**
     * 更新交易列表
     */
    public updateRecordList() {
        if (!this.props.currencyName) return;
        const cloudWallets = getStore('cloud/cloudWallets');
        const data = cloudWallets.get(CloudCurrencyType[this.props.currencyName]).otherLogs;
        this.props.otherNext = data.start; 
        this.props.recordList = this.parseList(data.list);
        this.props.recordList.sort((v1,v2) => {
            return v2.time - v1.time;
        });
        this.props.canLoadMore = data.canLoadMore;
        this.props.isRefreshing = false;
        this.paint();
    }

    /**
     * 解析全部记录
     */
    public parseList(list:any[]) {
        list.forEach((item) => {
            // tslint:disable-next-line:max-line-length
            item.amountShow = item.amount >= 0 ? `+${item.amount} ${currencyType(this.props.currencyName)}` : `${item.amount} ${currencyType(this.props.currencyName)}`;
            item.timeShow = timestampFormat(item.time).slice(5);
            item.iconShow = `${item.behaviorIcon}`;
        });

        return list;
    }

    /**
     * 查看详情界面
     */
    public recordListItemClick(e:any,index:number) {
        if (this.props.recordList[index].oid) {
            popNew('app-view-wallet-cloudWalletSC-transactionDetails',{ oid:this.props.recordList[index].oid });
        }
    }

    /**
     * 请求更多数据
     */
    public loadMore() {
        getAccountDetail(this.props.currencyName,0,this.props.otherNext);
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
