/**
 * 交易详情页面
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { canResend, copyToClipboard, parseAccount, parseStatusShow, popNewMessage, timestampFormat } from '../../../utils/tools';

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
        const obj = parseStatusShow(tx);
        this.state = {
            ...tx,
            hashShow:parseAccount(tx.hash),
            timeShow:timestampFormat(tx.time),
            statusShow:obj.text,
            statusIcon:obj.icon,
            minerFeeUnit:tx.currencyName !== 'BTC' ? 'ETH' : 'BTC',
            canResend:canResend(tx),
            qrcode:`https://ropsten.etherscan.io/tx/${tx.hash}`
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }

    public resendClick() {
        popNew('app-view-wallet-transaction-transfer',{ tx:this.props.tx,currencyName:this.props.tx.currencyName });
    }

    public copyToAddr() {
        copyToClipboard(this.state.toAddr);
        popNewMessage('复制成功');
    }
    public copyFromAddr() {
        copyToClipboard(this.state.fromAddr);
        popNewMessage('复制成功');
    }
    public copyHash() {
        copyToClipboard(this.state.hash);
        popNewMessage('复制成功');
    }
    public copyEtherscan() {
        copyToClipboard(this.state.qrcode);
        popNewMessage('复制成功');
    }

}
