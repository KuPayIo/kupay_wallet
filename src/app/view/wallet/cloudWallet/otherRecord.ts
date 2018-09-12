/**
 * other record
 */
import { Widget } from "../../../../pi/widget/widget";
import { getAccountDetail } from "../../../net/pull";
import { register } from "../../../store/store";
import { Forelet } from "../../../../pi/widget/forelet";
import { CurrencyType, AccountDetail } from "../../../store/interface";
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
export class otherRecord extends Widget{
    public props:Props;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init() {
        if(this.props.isActive){
            getAccountDetail(this.props.currencyName);
        }
        this.state = {
            recordList:[]
        }
    }
    public updateRecordList(accountDetail:Map<CurrencyType | string, AccountDetail[]>) {
        const list = accountDetail.get(this.props.currencyName);
        this.state.recordList = this.parseRecordList(list);
        this.paint();
    }
    public parseRecordList(list){
        list.forEach((item)=>{
            item.amountShow = item.amount >= 0 ? `+${item.amount}` : `${item.amount}`;
            item.timeShow = timestampFormat(item.time).slice(5);
            item.iconShow = `${item.behaviorIcon}`;
        });

        return list;
    }
}

register('accountDetail', (accountDetail) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateRecordList(accountDetail);
    }
});