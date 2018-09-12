/**
 * other record
 */
import { Widget } from "../../../../pi/widget/widget";
import { getRechargeLogs, getWithdrawLogs } from "../../../net/pull";
import { register } from "../../../store/store";
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
            recordList:[]
        }
    }
    public updateRecordList(withdrawLogs:Map<CurrencyType | string, RechargeWithdrawalLog[]>) {
        const list = withdrawLogs.get(this.props.currencyName);
        this.state.recordList = this.parseRecordList(list);
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
}

register('withdrawLogs', (withdrawLogs) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateRecordList(withdrawLogs);
    }
});