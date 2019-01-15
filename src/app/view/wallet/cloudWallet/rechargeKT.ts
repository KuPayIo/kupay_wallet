/**
 * 充值KT
 */

import { Widget } from "../../../../pi/widget/widget";
import { Forelet } from "../../../../pi/widget/forelet";
import { register, getCloudBalances, getStore } from "../../../store/memstore";
import { popNewMessage, formatBalance } from "../../../utils/tools";
import { CloudCurrencyType } from "../../../store/interface";
import { getServerCloudBalance, getAccountDetail, getGoldPrice } from "../../../net/pull";
import { popNew } from "../../../../pi/ui/root";
import { confirmPay } from "../../../utils/pay";
import { kt2kpt } from "../../../utils/unitTools";


// ============================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');


interface Props {
    payType: string; // 支付方式
    payList: any;    // 支付项列表
    selectPayItem: any; // 选择的支付项
    STprice: number; // ST价格
    total: number;  // 总金额(元)
    num: number;  // 充值KT数
    giveST: number; // 赠送ST
}

export class RechargeKT extends Widget {
    public ok: () => void;
    public props: Props = {
        payType: 'wxpay',
        payList: [
            { KTnum: 20, sellPrize: 20 },
            { KTnum: 50, sellPrize: 50 },
            { KTnum: 100, sellPrize: 100 },
            { KTnum: 200, sellPrize: 200 },
            { KTnum: 500, sellPrize: 500 },
            { KTnum: 1000, sellPrize: 1000 },
        ],
        giveST: 0,
        selectPayItem: {},
        STprice: 1,
        total: 0,
        num: 0.00,
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
        this.props.STprice = getStore('third/goldPrice/price');
        this.paint();
    }

    public rechargeClick() {
        if (this.props.total < 20) {
            popNewMessage({ zh_Hans: '最少充值20KT', zh_Hant: '最少充值20KT', en: '' });

            return;
        }

        const orderDetail = {
            total: this.props.total * 100, // 总价
            body: 'KT', // 信息
            num: kt2kpt(this.props.num), // 充值KT数量
            payType: this.props.payType, // 支付方式
            type: CloudCurrencyType.KT // 充值类型
        };
        confirmPay(orderDetail, (res) => {
            this.props.num = 0.00;
            this.props.total = 0.00;
            this.props.payType = 'alipay';

            popNew('app-view-wallet-cloudWalletGT-transactionDetails', { oid: res.oid, firstQuery: true });
            getServerCloudBalance();
            getAccountDetail(CloudCurrencyType[100], 1);
            this.paint();
        }, () => {
            getServerCloudBalance();
        });
    }
    /**
     * 修改支付方式
     * @param payType 支付方式
     */
    public changPay(payType: string) {
        this.props.payType = payType;
        this.paint();
    }

    /**
     * 修改支付KT数量的选择
     */
    public changePayItem(index?: number) {
        if (index !== -1) {
            this.props.selectPayItem = this.props.payList[index];
            this.props.num = this.props.selectPayItem.KTnum;
            this.props.total = this.props.num * 1;
            this.props.giveST = Math.floor(this.props.num / (this.props.STprice * 1.15)*100) / 100;
        } else {
            this.props.selectPayItem = {};
            this.props.num = 0;
            this.props.total = this.props.num * 1;
            this.props.giveST = 0;
        }
        this.paint();
    }

    /**
     * 修改充值金额
     */
    public amountChange(e: any) {
        this.changePayItem(-1);
        if (e.value === '') {
            this.props.total = 0;
        } else {
            this.props.total = e.value;
        }
        this.props.num = this.props.total / 1;
        this.props.giveST = Math.floor(this.props.num / (this.props.STprice * 1.15)*100) / 100;
        this.paint();
    }
    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}


// 余额变化
register('cloud/cloudWallets', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});