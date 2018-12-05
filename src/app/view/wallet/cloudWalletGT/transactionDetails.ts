/**
 * GT交易详情页面
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { TxType } from '../../../store/interface';
import { fetchLocalTxByHash1 } from '../../../utils/walletTools';

// ============================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface Props {
    state:string;
    transactionTime:string;
    transactionType:string;
    money:string;
    GTNum:number;
}
export class TransactionDetails extends Widget {
    public props:Props = {
        state:'完成',
        transactionTime:'2018.10.12 05:12:30',
        transactionType:'微信支付',
        money:'12.00',
        GTNum:0.005
    };
    public ok:() => void;

    /**
     * 返回
     */
    public backPrePage() {
        this.ok && this.ok();
    }

}
