/**
 * GT 充值页面
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getAccountDetail, getGoldPrice, getServerCloudBalance } from '../../../net/pull';
import { CloudCurrencyType } from '../../../store/interface';
import { getCloudBalances, getStore, register } from '../../../store/memstore';
import { confirmPay } from '../../../utils/recharge';
import { formatBalance, popNewMessage } from '../../../utils/tools';

// ============================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface Props {
    payType:string; // 支付方式
    goldPrice:number; // 黄金价格
    total:number;  // 总金额(元)
    num:number;  // 充值GT数
    balance:number; // GT余额
}

export class RechargeGT extends Widget {
    public ok:() => void; 
    public props:Props = {
        payType : 'wxpay',
        goldPrice:200,
        total:0,
        num:0.00,
        balance:formatBalance(getCloudBalances().get(CloudCurrencyType.GT))
    };
    constructor() {
        super();
    }

    public create() {
        super.create();
        getGoldPrice(1);
        setTimeout(() => {
            getGoldPrice(1);
        }, 500000);
    }

    public initData() {
        if (getStore('third/goldPrice/price') !== 0) {
            this.props.num = Math.floor((this.props.total / getStore('third/goldPrice/price') * 100) * 1000000) / 1000000;
        }
        
        this.props.balance = formatBalance(getCloudBalances().get(CloudCurrencyType.GT));
        this.paint();
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

    /**
     * 修改金额
     */
    public amountChange(e:any) {
        if (e.value === '') {
            this.props.total = 0;
        } else {
            this.props.total = parseFloat(e.value);
        }
        this.props.num = Math.floor((this.props.total / getStore('third/goldPrice/price') * 100) * 1000000) / 1000000;
        this.paint();
        
    }
    /**
     * 充值事件
     */
    public rechargeClick() {
        if (this.props.total === 0) {
            popNewMessage({ zh_Hans:'请输入充值GT数量',zh_Hant:'请输入充值GT数量',en:'' });
            
            return;
        }
        const orderDetail = {
            total: Math.floor(this.props.total * 100), // 总价
            body: 'GT', // 信息
            num: this.props.num * 1000000, // 充值GT数量
            payType: this.props.payType, // 支付方式
            type:CloudCurrencyType.GT // 充值类型
        };
        confirmPay(orderDetail,(res) => {
            this.props.num = 0.00;
            this.props.total = 0.00;
            this.props.payType = 'alipay';
            
            popNew('app-view-wallet-cloudWalletGT-transactionDetails',{ oid:res.oid,firstQuery:true });
            getServerCloudBalance();
            getAccountDetail('GT',1);
            this.paint();
        },() => {
            getServerCloudBalance();
        });
    }
}

// gasPrice变化
register('third/goldPrice',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});

// 余额变化
register('cloud/cloudWallets', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});