/**
 * 交易详情页面
 */
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getModulConfig } from '../../../modulConfig';
import { getOneUserInfo } from '../../../net/pull';
import { TaskSid } from '../../../store/parse';
import { SCPrecision } from '../../../utils/constants';
import { getOrderDetail, getOrderLocal } from '../../../utils/recharge';
import { popNewMessage, timestampFormat } from '../../../utils/tools';

// ============================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface Props {
    scShow:string;
    oid:string;
    itype:string | number;
    ctype:number;   //  入账1 出账 2
    state:string;
    transactionTime:string;
    transactionType:string;
    money:number;
    amount:number;
    beneficiary?:string; // 收款方
    transactionId?:string;   // 订单号
}

enum PayState {
    '未支付' = 0,
    '支付成功' = 1,
    '支付异常' = 2,
    '查询失败' = 3
}
export class TransactionDetails extends Widget {
    public ok:() => void;

    public setProps(props:any) {
        this.props = {
            scShow:getModulConfig('SC_SHOW'),
            state:'查询失败',
            transactionTime:'',
            transactionType:'',
            money:0,
            amount:0,
            ...props
        };
        super.setProps(this.props);
        this.initData();
    }

    /**
     * 获取数据
     */
    public initData() {
        const itype = this.props.itype;
        if (itype === TaskSid.Alipay || itype === TaskSid.Wxpay) {   // 微信支付宝支付
            getOrderDetail(this.props.oid).then(res => {
                this.setData(res);
            }).catch(() => {
                popNewMessage({ zh_Hans:'获取订单信息失败',zh_Hant:'获取订单信息失败',en:'' });
                this.props.state = PayState[3];                
                this.paint();
            });
        } else {
            getOrderLocal(this.props.oid).then(res => {
                this.setData1(res);
            }).catch(() => {
                popNewMessage({ zh_Hans:'获取订单信息失败',zh_Hant:'获取订单信息失败',en:'' });
                this.props.state = PayState[3];                
                this.paint();
            });
        }
       
    }
    
    // 支付宝微信
    public setData(res:any) {
        this.props.state = PayState[res.state];
        this.props.amount = res.num / SCPrecision;
        this.props.money = res.total / SCPrecision;
        this.props.transactionTime = timestampFormat(res.time * 1000); 
        this.props.transactionType = res.payType === 'alipay' ? '支付宝支付' :'微信支付' ;
        this.paint();
    }

    // 云端支付
    public async setData1(res:any) {
        const mchInfo = await getOneUserInfo([Number(res.mch_id)]);
        console.log(`商户信息 ========== mch_id = ${res.mch_id}  mchInfo = ${mchInfo}`);
        this.props.state = PayState[1];
        this.props.amount = res.total_fee / SCPrecision;
        this.props.money = res.total_fee / SCPrecision;
        this.props.transactionTime = timestampFormat(res.time_end * 1000); 
        this.props.transactionType = this.props.ctype === 1 ? '充值' : '消费' ;
        this.props.transactionId = res.transaction_id;
        this.props.beneficiary = (mchInfo && mchInfo.nickName) || '好嗨游戏';
        this.paint();
    }
    /**
     * 返回
     */
    public backPrePage() {
        this.ok && this.ok();
    }

}
