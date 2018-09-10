/**
 * 交易详情页面
 */
import { Widget } from '../../../../pi/widget/widget';
import { parseAccount, parseStatusShow, timestampFormat, canResend } from '../../../utils/tools';
import { Forelet } from '../../../../pi/widget/forelet';
import { popNew } from '../../../../pi/ui/root';

// ============================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
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
        const tx = this.props.tx;
        const obj = parseStatusShow(tx.status);
        this.state = {
            ...tx,
            hash:parseAccount(tx.hash),
            timeShow:timestampFormat(tx.time),
            statusShow:obj.text,
            statusIcon:obj.icon,
            minerFeeUnit:tx.currencyName !== 'BTC' ? 'ETH' : 'BTC',
            canResend:canResend(tx),
            qrcode:`https://ropsten.etherscan.io/tx/${tx.fromAddr}`
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }

    public resendClick(){
        popNew('app-view-wallet-transaction-transfer',{tx:this.props.tx,currencyName:this.props.tx.currencyName});
    }
}
