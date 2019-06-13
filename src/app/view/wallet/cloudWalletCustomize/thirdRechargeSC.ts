/**
 * 第三方充值SC
 */

import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getAccountDetail } from '../../../net/pull';
import { SCPrecision } from '../../../publicLib/config';
import { CloudCurrencyType } from '../../../publicLib/interface';
import { getModulConfig } from '../../../publicLib/modulConfig';
import { getCloudBalances, getStore } from '../../../store/memstore';
import { SCUnitprice, wxPayShow } from '../../../utils/constants';
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
        const needPay = (props.order.total_fee - scBalance * SCPrecision) / SCPrecision;
        this.props = {
            ...props,
            acc_id:getStore('user/info').acc_id,
            scShow:getModulConfig('SC_SHOW'),
            scBalance,
            total_fee_show:props.order.total_fee / SCPrecision,
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
        const num = this.props.needPay * SCPrecision;
        const orderDetail:OrderDetail = {
            total: num * SCUnitprice, // 总价
            body: wxPayShow, // 信息
            num, // 充值SC数量
            payType: this.props.payType, // 支付方式
            cointype: CloudCurrencyType.SC, // 充值类型
            note: ''          // 备注
        };
        confirmPay(orderDetail).then(res => {
            if (res) {
                getAccountDetail(CloudCurrencyType[CloudCurrencyType.SC],1);
                this.props.okCB && this.props.okCB();
                setTimeout(() => {
                    this.ok && this.ok(true);
                },500);
            }
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
        this.props.okCB && this.props.okCB();
        setTimeout(() => {
            this.ok && this.ok(false);
        },500);
    }
}
