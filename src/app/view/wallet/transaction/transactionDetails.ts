/**
 * 交易详情页面
 */
import { Widget } from '../../../../pi/widget/widget';
import { TxStatus } from '../../../store/interface';
import { parseAccount, timestampFormat } from '../../../utils/tools';
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
        const obj = this.parseStatusShow(this.props.tx.status);
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
    public parseStatusShow(status:TxStatus) {
        if (status === TxStatus.PENDING) {
            return {
                text:'打包中',
                icon:'pending.png'
            };
        } else if (status === TxStatus.CONFIRMED) {
            return {
                text:'已确认',
                icon:'pending.png'
            };
        } else if (status === TxStatus.FAILED) {
            return {
                text:'交易失败',
                icon:'fail.png'
            };
        } else {
            return {
                text:'完成',
                icon:'icon_right2.png'
            };
        }
    }
}