/**
 * 充值KT
 */

import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getModulConfig } from '../../../modulConfig';
import { getAccountDetail, getServerCloudBalance, getSilverPrice } from '../../../net/pull';
import { CloudCurrencyType } from '../../../store/interface';
import { getStore, register } from '../../../store/memstore';
import { confirmPay } from '../../../utils/recharge';
import { popNewMessage } from '../../../utils/tools';
import { ST2st } from '../../../utils/unitTools';

// ============================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface Props {
    ktShow:string;  // KT界面显示
    stShow:string;  // ST界面显示
    payType: string; // 支付方式
    payList: any;    // 支付项列表
    selectPayItem: any; // 选择的支付项
    STprice: number; // ST价格
    total: number;  // 总金额(元)
    giveST: number; // 赠送ST
    inputValue: number; // 输入的金额
}

export class RechargeKT extends Widget {
    public ok: () => void;
    public props: Props = {
        ktShow:getModulConfig('KT_SHOW'),
        stShow:getModulConfig('ST_SHOW'),
        payType: 'wxpay',
        payList: [
            { KTnum: 20, sellPrize: 20 },
            { KTnum: 50, sellPrize: 50 },
            { KTnum: 100, sellPrize: 100 },
            { KTnum: 200, sellPrize: 200 },
            { KTnum: 500, sellPrize: 500 },
            { KTnum: 1000, sellPrize: 1000 }
        ],
        giveST: 0,
        selectPayItem: {},
        STprice: 1,
        total: 0,
        inputValue: 0
    };
    constructor() {
        super();
    }

    public setProps(prop: any) {
        super.setProps(this.props);
    }

    public create() {
        super.create();
        getSilverPrice(1).then(() => {
            this.changePayItem(0);
        });
        setTimeout(() => {
            getSilverPrice(1);
        }, 500000);
    }

    public initData() {
        this.props.STprice = getStore('third/silver/price') / 100;
        this.paint();
    }

    public rechargeClick() {
        if (this.props.total < 20) {
            popNewMessage({ zh_Hans: `最少充值20${this.props.ktShow}`, zh_Hant: `最少充值20${this.props.ktShow}`, en: '' });

            return;
        }

        const orderDetail = {
            total: this.props.total * 100, // 总价
            body: 'KT', // 信息
            num: ST2st(this.props.giveST), // 充值ST数量
            payType: this.props.payType, // 支付方式
            type: CloudCurrencyType.ST, // 充值类型
            note: 1
        };
        confirmPay(orderDetail, (res) => {
            this.inputChange({ value: 0 });
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
        this.props.inputValue = null; // 清空自定义输入支付数量
        this.props.selectPayItem = this.props.payList[index];
        this.setOrderNum(this.props.selectPayItem.sellPrize);
        this.paint();
    }

    /**
     * 修改充值金额
     */
    public inputChange(e: any) {
        this.props.selectPayItem = {}; // 清空固定支付数量选择
        if (e.value === '') {
            this.props.inputValue = 0;
        } else {
            this.props.inputValue = e.value;
        }
        this.setOrderNum(this.props.inputValue);
        this.paint();
    }

    /**
     * 设置订单相关数量
     * @param total 总金额
     */
    public setOrderNum(total: number) {
        if (total === 0) {
            this.props.total = 0;
            this.props.giveST = 0;
        } else {
            this.props.total = total;
            this.props.giveST = Math.floor(this.props.total / (this.props.STprice * 1.15) * 100) / 100;
        }
    }
    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}

// gasPrice变化
register('third/silver', () => {
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