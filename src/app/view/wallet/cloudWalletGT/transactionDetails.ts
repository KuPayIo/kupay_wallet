/**
 * GT交易详情页面
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getModulConfig } from '../../../modulConfig';
import { getOrderDetail, getPayState } from '../../../utils/recharge';
import { formatBalance, popNewMessage, timestampFormat } from '../../../utils/tools';

// ============================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface Props {
    stShow:string;
    oid:string;
    firstQuery:boolean;
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
        stShow:getModulConfig('ST_SHOW'),
        oid:'',
        firstQuery:false,
        state:'失败',
        transactionTime:'0',
        transactionType:'未支付',
        money:0,
        GTNum:0
    };
    public ok:() => void;

    public setProps(props:any) {
        this.props.oid = props.oid;
        this.props.firstQuery = props.firstQuery || false;
        super.setProps(this.props);
        this.initData();
    }

    /**
     * 获取数据
     */
    public initData() {
        if (this.props.firstQuery) {
            getPayState(this.props.oid,(res) => {
                this.setData(res);
            },(err) => {
                this.props.state = PayState[3];                
                this.paint();
            });
        } else {
            getOrderDetail(this.props.oid,(res) => {
                this.setData(res);
            },(err) => {
                this.props.state = PayState[3];                
                this.paint();
            });
        }
    }
    
    public setData(res:any) {
        this.props.state = PayState[res.state];
        this.props.GTNum = res.num / 1000000;
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
