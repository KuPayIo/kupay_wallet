/**
 * 充值SC
 */

import { setStore } from '../../../../chat/client/app/data/store';
import { IAPManager } from '../../../../pi/browser/iap_manager';
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { callGetAccountDetail } from '../../../middleLayer/wrap';
import { confirmApplePay, getAppleGoods } from '../../../net/pull';
import { SCPrecision } from '../../../publicLib/config';
import { CloudCurrencyType, TaskSid } from '../../../publicLib/interface';
import { getModulConfig } from '../../../publicLib/modulConfig';
import { rechargeGiftMultiple, SCUnitprice, wxPayShow } from '../../../utils/constants';
import { confirmPay, OrderDetail, PayType } from '../../../utils/recharge';
import { popNewMessage } from '../../../utils/tools';
import { getCloudBalances, registerStoreData } from '../../../viewLogic/common';

// ============================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
declare var pi_update:any;
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
    public setProps(props: Props) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
    }

    public create() {
        super.create();
        const androidPayList = [
            { sellNum: 20, sellPrize: 20 },
            { sellNum: 50, sellPrize: 50 },
            { sellNum: 100, sellPrize: 100 },
            { sellNum: 200, sellPrize: 200 },
            { sellNum: 500, sellPrize: 500 },
            { sellNum: 1000, sellPrize: 1000 }
        ];

        const iosPayList = [
            { sellNum: 6, sellId: 'high_xzxd_6',sellPrize:6 },
            { sellNum: 30, sellId: 'high_xzxd_30',sellPrize:30 },
            { sellNum: 68, sellId: 'high_xzxd_68',sellPrize:68 },
            { sellNum: 98, sellId: 'high_xzxd_98',sellPrize:98 },
            { sellNum: 198, sellId: 'high_xzxd_198',sellPrize:198 },
            { sellNum: 328, sellId: 'high_xzxd_328',sellPrize:328 },
            { sellNum: 648, sellId: 'high_xzxd_648',sellPrize:648 },
            { sellNum: 1298, sellId: 'high_xzxd_1298',sellPrize:1298 },
            { sellNum: 2998, sellId: 'high_xzxd_2998',sellPrize:2998 },
            { sellNum: 6498, sellId: 'high_xzxd_6498',sellPrize:6498 }
        ];
        
        const payList = pi_update.inIOSApp ? iosPayList : androidPayList;
        const selectPayItemIndex = 0;
        const SCNum = payList[selectPayItemIndex].sellNum;
        const giveKT = SCNum * rechargeGiftMultiple;
        this.props = {
            ktShow:getModulConfig('KT_SHOW'),
            scShow:getModulConfig('SC_SHOW'),
            scBalance:0,
            payType: pi_update.inIOSApp ? PayType.IOS : PayType.WX,
            payList,
            giveKT,
            selectPayItemIndex,
            SCNum,
            PayType,
            inIOSApp:pi_update.inIOSApp
        };

        getCloudBalances().then(cloudBalances => {
            this.props.scBalance = cloudBalances.get(CloudCurrencyType.SC);
            this.paint();
        });
        if (pi_update.inIOSApp) {
            this.initGoods();
        }
    }

    /**
     * 更新商品
     */
    public async initGoods() {
        const res = await getAppleGoods();
        console.log('===========================apple',res);
        this.props.payList = [];
        for (const v of res.value) {
            this.props.payList.push({ sellId:v[0], sellNum:v[1] / SCPrecision,sellPrize:v[1] / SCPrecision });
        }
        this.props.payList = this.props.payList.sort((item1,item2) => {
            return item1.sellNum - item2.sellNum;
        });
        this.paint();
    }

    // 初始化
    public initData() {
        const selectPayItemIndex = 0;
        const SCNum = this.props.payList[selectPayItemIndex].sellNum;
        const giveKT = SCNum * rechargeGiftMultiple;
        this.props.payType = pi_update.inIOSApp ? PayType.IOS : PayType.WX;
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
        confirmPay(orderDetail,sellId).then(res => {
            if (res) {
                this.initData();
                const itype = this.props.payType === PayType.WX ? TaskSid.Wxpay : TaskSid.Wxpay;
                popNew('app-view-wallet-cloudWalletCustomize-transactionDetails', { oid: res.oid,itype,ctype:1 });
                this.paint();
                setStore('flags/firstRecharge',true); // 首次充值
                callGetAccountDetail(CloudCurrencyType[CloudCurrencyType.SC],1);
            } else {
                // 监听苹果支付成功回调
                IAPManager.addTransactionListener((issuccess:Number,sd: string,transtion: string,num:number) => {
                    IAPManager.removeTransactionListener(num); // 移除监听事件
                    if (issuccess) {
                        confirmApplePay(sd,transtion).then(res => {
                            console.log('================验证苹果支付是否成功',res);
                            if (res.result === 'SUCCESS') {
                                popNewMessage('支付成功');
                            } else {
                                popNewMessage('支付失败');
                            }
                            this.initData();
                            this.paint();

                            popNew('app-view-wallet-cloudWalletCustomize-transactionDetails', { oid: sd,itype:TaskSid.Apple_pay,ctype:1 });
                            setStore('flags/firstRecharge',true); // 首次充值
                            callGetAccountDetail(CloudCurrencyType[CloudCurrencyType.SC],1);
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
registerStoreData('cloud/cloudWallets', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        getCloudBalances().then(cloudBalances => {
            w.props.scBalance = cloudBalances.get(CloudCurrencyType.SC);
            w.paint();
        });
    }
});