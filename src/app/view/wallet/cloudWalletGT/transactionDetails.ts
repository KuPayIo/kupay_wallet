/**
 * GT交易详情页面
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { TxType } from '../../../store/interface';
import { queryPayState } from '../../../utils/pay';
import { fetchBalanceValueOfGT, formatBalance, popNewMessage } from '../../../utils/tools';
import { fetchLocalTxByHash1 } from '../../../utils/walletTools';

// ============================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface Props {
    oid:string;
    state:string;
    transactionTime:string;
    transactionType:string;
    money:number;
    GTNum:number;
}
export class TransactionDetails extends Widget {
    public props:Props = {
        oid:'',
        state:'失败',
        transactionTime:'0',
        transactionType:'未支付',
        money:0,
        GTNum:0
    };
    public ok:() => void;

    public setProps(props:any) {
        this.props.oid = props.oid;
        super.setProps(this.props);
        this.initData();
    }

    public initData() {
        queryPayState(this.props.oid,(res) => {
            this.props.state = '完成';
            this.props.GTNum = res.num;
            this.props.money = formatBalance(fetchBalanceValueOfGT(res.num));
            this.props.transactionTime = '100';
            this.props.transactionType = res.payType === 'alipay' ? '支付宝支付' :'微信支付' ;
            this.paint();
        },(res) => {
            if (res.result === 3003) {
                this.props.state = '待支付';
            } else {                
                popNewMessage({ zh_Hans:'获取订单信息失败',zh_Hant:'获取订单信息失败',en:'' });
            }
            this.paint();
        });
    }

    /**
     * 返回
     */
    public backPrePage() {
        this.ok && this.ok();
    }

}
