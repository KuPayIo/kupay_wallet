/**
 * other record
 */
import { Widget } from "../../../../pi/widget/widget";
import { getRechargeLogs, getWithdrawLogs } from "../../../net/pull";
import { register, getBorn } from "../../../store/store";
import { Forelet } from "../../../../pi/widget/forelet";
import { CurrencyType, AccountDetail, RechargeWithdrawalLog } from "../../../store/interface";
import { timestampFormat } from "../../../utils/tools";
// ===================================================== 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface Props{
    currencyName:string;
    isActive:boolean;
}
export class WithdrawRecord extends Widget{
    public props:Props;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init() {
        if(this.props.isActive){
            getWithdrawLogs(this.props.currencyName);
        }
        this.state = {
            recordList:[],
            nextStart:0,
            canLoadMore:false,
            isRefreshing:false
        }
    }
    public updateRecordList() {
        const withdrawLogs = getBorn('withdrawLogs').get(CurrencyType[this.props.currencyName]);
        console.log(withdrawLogs);
        const list = withdrawLogs.list;
        this.state.nextStart = withdrawLogs.start;
        this.state.canLoadMore = withdrawLogs.canLoadMore;
        this.state.recordList = this.parseRecordList(list);
        this.state.isRefreshing = false;
        this.paint();
    }

    public parseRecordList(list){
        list.forEach((item)=>{
            item.behavior = '充值';
            item.amountShow = item.amount >= 0 ? `+${item.amount}` : `${item.amount}`;
            item.timeShow = timestampFormat(item.time).slice(5);
            item.iconShow = `cloud_charge_icon.png`;
        });

        return list;
    }
    public loadMore(){
        getWithdrawLogs(this.props.currencyName,this.state.nextStart);
    }
    public getMoreList(){
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

register('withdrawLogs', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateRecordList();
    }
});