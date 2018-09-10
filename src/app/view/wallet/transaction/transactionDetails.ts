/**
 * 交易详情页面
 */
import { Widget } from '../../../../pi/widget/widget';
import { TxStatus } from '../../../store/interface';
import { parseAccount, parseStatusShow, timestampFormat } from '../../../utils/tools';
interface Props {
    tx:any;
}
export class TransactionDetails extends Widget {
    public props:Props;
    public ok:() => void;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init() {
        const obj = parseStatusShow(this.props.tx.status);
        this.state = {
            ...this.props.tx,
            hash:parseAccount(this.props.tx.hash),
            timeShow:timestampFormat(this.props.tx.time),
            statusShow:obj.text,
            statusIcon:obj.icon,
            minerFeeUnit:this.props.tx.currencyName !== 'BTC' ? 'ETH' : 'BTC',
            qrcode:`https://ropsten.etherscan.io/tx/${this.props.tx.fromAddr}`
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }
}