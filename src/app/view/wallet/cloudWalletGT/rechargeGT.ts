/**
 * GT 充值页面
 */
import { Widget } from '../../../../pi/widget/widget';
import { fetchBalanceValueOfCoin, formatBalance, getCurrencyUnitSymbol, popNewMessage } from '../../../utils/tools';

interface Props {
    payType:PayType; // 支付方式
    glodPrice:number; // 黄金价格
    total:string;  // 总金额
    gt:string;  // 充值GT数
    currencyUnitSymbol:string; // 钱符号
}

enum PayType {
    wxPay = 1,
    aliPay = 2

}
export class RechargeGT extends Widget {
    public ok:() => void; 
    public props:Props = {
        payType : 1,
        glodPrice:200,
        total:'0.00',
        gt:'0',
        currencyUnitSymbol:getCurrencyUnitSymbol()
    };
    constructor() {
        super();
    }
    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
    /**
     * 修改支付方式
     * @param payType 支付方式
     */
    public changPay(payType:number) {
        this.props.payType = payType;
        this.paint();
    }

    public amountChange(e:any) {
        this.props.gt = e.value;
        const amountShow = formatBalance(fetchBalanceValueOfCoin('GT',e.value));
        this.props.total =  amountShow === 0 ? '0.00' :`${amountShow}`;
        this.paint();
    }
    /**
     * 充值事件
     */
    public rechargeClick() {
        if (this.props.gt === '0') {
            popNewMessage({ zh_Hans:'请输入充值GT数量',zh_Hant:'请输入充值GT数量',en:'' });
        }
    }
}