/**
 * 充值SC
 */

import { setStore } from '../../../../chat/client/app/data/store';
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getModulConfig } from '../../../modulConfig';
import { getAccountDetail } from '../../../net/pull';
import { CloudCurrencyType } from '../../../store/interface';
import { getCloudBalances, register } from '../../../store/memstore';
import { rechargeGiftMultiple, SCPrecision, SCUnitprice } from '../../../utils/constants';
import { confirmPay, OrderDetail, PayType } from '../../../utils/recharge';

// ============================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface Props {
    ktShow:string;  // KT界面显示
    scShow:string;  // SC界面显示
    payType: PayType; // 支付方式
    payList: any;    // 支付项列表
    selectPayItemIndex: number; // 选择的支付项
    SCprice: number; // SC价格
    total: number;  // 总金额(元)
    giveKT: number; // 赠送ST
    SCNum: number; // 输入的金额
}

export class RechargeSC  extends Widget {
    public ok: () => void;
    public setProps(prop: any) {
        super.setProps(this.props);
    }

    public create() {
        super.create();
        const payList = [
            { sellNum: 20, sellPrize: 20 },
            { sellNum: 50, sellPrize: 50 },
            { sellNum: 100, sellPrize: 100 },
            { sellNum: 200, sellPrize: 200 },
            { sellNum: 500, sellPrize: 500 },
            { sellNum: 1000, sellPrize: 1000 }
        ];
        const selectPayItemIndex = 0;
        const SCNum = payList[selectPayItemIndex].sellNum;
        const giveKT = SCNum * rechargeGiftMultiple;
        const scBalance = getCloudBalances().get(CloudCurrencyType.SC);
        this.props = {
            ktShow:getModulConfig('KT_SHOW'),
            scShow:getModulConfig('SC_SHOW'),
            scBalance,
            payType: PayType.WX,
            payList,
            giveKT,
            selectPayItemIndex,
            SCNum,
            PayType
        };
    }

    // 初始化
    public initData() {
        const selectPayItemIndex = 0;
        const SCNum = this.props.payList[selectPayItemIndex].sellNum;
        const giveKT = SCNum * rechargeGiftMultiple;
        this.props.payType = PayType.WX;
        this.props.SCNum = SCNum;
        this.props.giveKT = giveKT;
        this.props.selectPayItemIndex = selectPayItemIndex;
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
            this.initData();
            popNew('app-view-wallet-cloudWalletSC-transactionDetails', { oid: res.oid, firstQuery: true });
            this.paint();
            setStore('flags/firstRecharge',true); // 首次充值
            getAccountDetail(CloudCurrencyType[CloudCurrencyType.SC],1);
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
     * 修改支付SC数量的选择
     */
    public changePayItem(index?: number) {
        this.props.selectPayItemIndex = index;
        this.props.SCNum = this.props.payList[index].sellNum;
        this.props.giveKT = this.props.SCNum * rechargeGiftMultiple;
        this.paint();
    }

    /**
     * 修改充值金额
     */
    public inputChange(e: any) {
        this.props.selectPayItemIndex = -1; // 清空固定支付数量选择
        if (e.value === '') {
            this.props.SCNum = 0;
        } else {
            this.props.SCNum = Math.floor(Number(e.value) * 100) / 100;  // 保留小数点后两位
        }
        this.props.giveKT = this.props.SCNum * rechargeGiftMultiple;
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
        const scBalance = getCloudBalances().get(CloudCurrencyType.SC);
        w.props.scBalance = scBalance;
        w.paint();
    }
});