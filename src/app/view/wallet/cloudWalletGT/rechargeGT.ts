/**
 * GT 充值页面
 */
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getGoldPrice } from '../../../net/pull';
import { register } from '../../../store/memstore';
import { fetchBalanceValueOfGT, formatBalance, getCurrencyUnitSymbol, popNewMessage } from '../../../utils/tools';

// ============================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface Props {
    payType:string; // 支付方式
    goldPrice:number; // 黄金价格
    total:string;  // 总金额
    num:string;  // 充值GT数
    currencyUnitSymbol:string; // 钱符号
}

export class RechargeGT extends Widget {
    public ok:() => void; 
    public props:Props = {
        payType : 'wxpay',
        goldPrice:200,
        total:'0.00',
        num:'0',
        currencyUnitSymbol:getCurrencyUnitSymbol()
    };
    constructor() {
        super();
    }

    public create() {
        super.create();
        getGoldPrice();
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
    public changPay(payType:string) {
        this.props.payType = payType;
        this.paint();
    }

    public amountChange(e:any) {
        this.props.num = e.value;
        const amountShow = formatBalance(fetchBalanceValueOfGT(e.value));
        this.props.total =  amountShow === 0 ? '0.00' :`${amountShow}`;
        this.paint();
    }
    /**
     * 充值事件
     */
    public rechargeClick() {
        if (this.props.num === '0') {
            popNewMessage({ zh_Hans:'请输入充值GT数量',zh_Hant:'请输入充值GT数量',en:'' });
        }
    }
}

// gasPrice变化
register('third/glodPrice',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateMinerFeeList();
    }
});