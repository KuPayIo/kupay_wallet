/**
 * red-envelope details
 */
import { Widget } from '../../../../pi/widget/widget';
import { queryDetailLog } from '../../../store/conMgr';

interface Props {
    rtype:number;// 红包类型
    ctype:number;// 币种
    ctypeShow:string;
    amount:number;// 金额
    time:number;// 时间
    timeShow:string;
    codes:string[];// 兑换码
}
export class RedEnvelopeDetails extends Widget {
    public ok:() => void;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.state = {};
        queryDetailLog();
    }
    public backPrePage() {
        this.ok && this.ok();
    }
}