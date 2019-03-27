/**
 * 第三方充值SC
 */

import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getModulConfig } from '../../../modulConfig';
import { getAccountDetail } from '../../../net/pull';
import { CloudCurrencyType } from '../../../store/interface';
import { getCloudBalances } from '../../../store/memstore';
import { SCPrecision, SCUnitprice } from '../../../utils/constants';
import { confirmPay, OrderDetail, PayType } from '../../../utils/recharge';

// ============================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class ThirdRechargeSC  extends Widget {
    public ok: (rechargeSuccess?:boolean) => void;
    public setProps(props: any) {
        const scBalance = getCloudBalances().get(CloudCurrencyType.SC);
        const needPay = (props.order.fee_total - scBalance) / SCPrecision;
        this.props = {
            ...props,
            scShow:getModulConfig('SC_SHOW'),
            scBalance,
            needPay,
            payType: PayType.WX,
            walletName:getModulConfig('WALLET_NAME')
        };
        super.setProps(this.props);
    }

    /**
     * 充值
     */
    public rechargeClick() {
        const num = this.props.SCNum * SCPrecision;
        const orderDetail:OrderDetail = {
            total: num * SCUnitprice, // 总价
            body: 'SC', // 信息
            num, // 充值SC数量
            payType: this.props.payType, // 支付方式
            cointype: CloudCurrencyType.SC, // 充值类型
            note: ''          // 备注
        };
        confirmPay(orderDetail, (res) => {
            getAccountDetail(CloudCurrencyType[CloudCurrencyType.SC],1);
            this.ok && this.ok(true);
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
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok(false);
    }
}
