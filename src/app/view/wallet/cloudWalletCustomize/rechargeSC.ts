/**
 * 充值SC
 */
import { setStore } from '../../../../chat/client/app/data/store';
import { IAPManager } from '../../../../pi/browser/iap_manager';
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getModulConfig } from '../../../modulConfig';
import { confirmApplePay, getAccountDetail, getAppleGoods } from '../../../net/pull';
import { CloudCurrencyType } from '../../../store/interface';
import { getCloudBalances, register } from '../../../store/memstore';
import { TaskSid } from '../../../store/parse';
import { rechargeGiftMultiple, SCPrecision, SCUnitprice, wxPayShow } from '../../../utils/constants';
import { confirmPay, OrderDetail, PayType } from '../../../utils/recharge';
import { popNewLoading, popNewMessage } from '../../../utils/tools';

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

export class RechargeSC extends Widget {
    public ok: () => void;
    
    public setProps(props: any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
    }

    public create() {
        super.create();
        const payList = [
            { sellNum: 6, sellId: 'high_xzxd_6' },
            { sellNum: 30, sellId: 'high_xzxd_30' },
            { sellNum: 68, sellId: 'high_xzxd_68' },
            { sellNum: 98, sellId: 'high_xzxd_98' },
            { sellNum: 198, sellId: 'high_xzxd_198' },
            { sellNum: 328, sellId: 'high_xzxd_328' },
            { sellNum: 648, sellId: 'high_xzxd_648' },
            { sellNum: 1298, sellId: 'high_xzxd_1298' },
            { sellNum: 2998, sellId: 'high_xzxd_2998' },
            { sellNum: 6498, sellId: 'high_xzxd_6498' }
        ];
        const selectPayItemIndex = 0;
        const SCNum = payList[selectPayItemIndex].sellNum;
        const giveKT = SCNum * rechargeGiftMultiple;
        const scBalance = getCloudBalances().get(CloudCurrencyType.SC);
        this.props = {
            ktShow:getModulConfig('KT_SHOW'),
            scShow:getModulConfig('SC_SHOW'),
            scBalance,
            payType: PayType.IOS,
            payList,
            giveKT,
            selectPayItemIndex,
            SCNum
        };
        this.initGoods();
    }

    /**
     * 更新商品
     */
    public async initGoods() {
        const res = await getAppleGoods();
        console.log('===========================apple',res);
        this.props.payList = [];
        for (const v of res.value) {
            this.props.payList.push({ sellId:v[0], sellNum:v[1] / SCPrecision });
        }
    }

    // 初始化
    public initData() {
        const selectPayItemIndex = 0;
        const SCNum = this.props.payList[selectPayItemIndex].sellNum;
        const giveKT = SCNum * rechargeGiftMultiple;
        this.props.payType = PayType.IOS;
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
            body: wxPayShow, // 信息
            num, // 充值SC数量
            payType: this.props.payType, // 支付方式
            cointype: CloudCurrencyType.SC, // 充值类型
            note: ''          // 备注
        };

        const sellId = this.props.payList[this.props.selectPayItemIndex].sellId;
        confirmPay(orderDetail, sellId).then(res => {
            if (res) {
                this.initData();
                const itype = this.props.payType === PayType.WX ? TaskSid.Wxpay : TaskSid.Alipay;
                popNew('app-view-wallet-cloudWalletCustomize-transactionDetails', { oid: res.oid,itype,ctype:1 });
                this.paint();
                setStore('flags/firstRecharge',true); // 首次充值
                getAccountDetail(CloudCurrencyType[CloudCurrencyType.SC],1);
            } else {
               
                IAPManager.addTransactionListener((issuccess:Number,sd: string,transtion: string) => {
                    if (issuccess) {
                        confirmApplePay(sd,transtion).then(res => {
                            console.log('================验证苹果支付是否成功',res);
                            this.initData();
                            this.paint();

                            popNew('app-view-wallet-cloudWalletCustomize-transactionDetails', { oid: sd,ctype:1 });
                            setStore('flags/firstRecharge',true); // 首次充值
                            getAccountDetail(CloudCurrencyType[CloudCurrencyType.SC],1);
                            popNewMessage('支付成功');
                        });
                            
                    } else {
                        popNewMessage('支付失败');
                           
                    }
                });

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
        if (this.props.okCB) {
            this.props.okCB && this.props.okCB();
            setTimeout(() => {
                this.ok && this.ok();
            },500);
        } else {
            this.ok && this.ok();
        }
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