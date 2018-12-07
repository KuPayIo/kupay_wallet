/**
 * GT 充值页面
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getGoldPrice } from '../../../net/pull';
import { CloudCurrencyType } from '../../../store/interface';
import { getCloudBalances, register } from '../../../store/memstore';
import { confirmPay } from '../../../utils/pay';
import { fetchBalanceValueOfGT, formatBalance, getCurrencyUnitSymbol, popNewMessage } from '../../../utils/tools';

// ============================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface Props {
    payType:string; // 支付方式
    goldPrice:number; // 黄金价格
    total:number;  // 总金额(元)
    num:string;  // 充值GT数
    currencyUnitSymbol:string; // 钱符号
    balance:number; // GT余额
}

export class RechargeGT extends Widget {
    public ok:() => void; 
    public props:Props = {
        payType : 'wxpay',
        goldPrice:200,
        total:0.00,
        num:'',
        currencyUnitSymbol:getCurrencyUnitSymbol(),
        balance:formatBalance(getCloudBalances().get(CloudCurrencyType.GT))
    };
    constructor() {
        super();
    }

    public create() {
        super.create();
        getGoldPrice(1);
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
        if (e.value) {
            this.props.num = e.value;
        } else {
            this.props.num = '0';
        }
        const amountShow = formatBalance(fetchBalanceValueOfGT(e.value));
        this.props.total =  amountShow === 0 ? 0.00 :amountShow;
        this.paint();
    }
    /**
     * 充值事件
     */
    public rechargeClick() {
        if (parseFloat(this.props.num) === 0 || !this.props.num) {
            popNewMessage({ zh_Hans:'请输入充值GT数量',zh_Hant:'请输入充值GT数量',en:'' });
            
            return;
        }
        const orderDetail = {
            total: Math.floor(this.props.total * 100), // 总价
            body: 'GT', // 信息
            num: parseFloat(this.props.num) * 1000000, // 充值GT数量
            payType: this.props.payType, // 支付方式
            type:CloudCurrencyType.GT // 充值类型
        };
        
        confirmPay(orderDetail,(res) => {
            this.props.num = '';
            this.props.total = 0.00;
            this.props.payType = 'wxpay';
            this.paint();
            popNew('app-view-wallet-cloudWalletGT-transactionDetails',{ oid:res.oid });
        },() => {
            popNewMessage({ zh_Hans:'充值失败，请重新充值',zh_Hant:'充值失败，请重新充值',en:'' });
        });
    }
}

// gasPrice变化
register('third/glodPrice',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateMinerFeeList();
    }
});