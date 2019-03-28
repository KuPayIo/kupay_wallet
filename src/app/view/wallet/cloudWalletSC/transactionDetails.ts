/**
 * SC交易详情页面
 */
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getModulConfig } from '../../../modulConfig';
import { getOrderDetail } from '../../../utils/recharge';
import { popNewMessage, timestampFormat } from '../../../utils/tools';

// ============================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface Props {
    scShow:string;
    oid:string;
    state:string;
    transactionTime:string;
    transactionType:string;
    money:number;
    GTNum:number;
}

enum PayState {
    '未支付' = 0,
    '支付成功' = 1,
    '支付异常' = 2,
    '查询失败' = 3
}
export class TransactionDetails extends Widget {
    public props:Props = {
        scShow:getModulConfig('SC_SHOW'),
        oid:'',
        state:'失败',
        transactionTime:'0',
        transactionType:'未支付',
        money:0,
        GTNum:0
    };
    public ok:() => void;

    public setProps(props:any) {
        this.props.oid = props.oid;
        super.setProps(this.props);
        this.initData();
    }

    /**
     * 获取数据
     */
    public initData() {
        getOrderDetail(this.props.oid).then(res => {
            this.setData(res);
        }).catch(() => {
            popNewMessage({ zh_Hans:'获取订单信息失败',zh_Hant:'获取订单信息失败',en:'' });
            this.props.state = PayState[3];                
            this.paint();
        });
        
        // popNewMessage({ zh_Hans:'获取订单信息失败',zh_Hant:'获取订单信息失败',en:'' });
    }
    
    public setData(res:any) {
        this.props.state = PayState[res.state];
        this.props.GTNum = res.num / 100;
        this.props.money = res.total / 100;
        this.props.transactionTime = timestampFormat(res.time * 1000); 
        this.props.transactionType = res.payType === 'alipay' ? '支付宝支付' :'微信支付' ;
        this.paint();
    }

    /**
     * 返回
     */
    public backPrePage() {
        this.ok && this.ok();
    }

}
