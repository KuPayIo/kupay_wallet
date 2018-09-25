/**
 * 交易详情页面
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { canResend, copyToClipboard, parseAccount, parseStatusShow, popNewMessage, timestampFormat } from '../../../utils/tools';
import { register } from '../../../store/store';
import { fetchLocalTxByHash1 } from '../../../utils/walletTools';
import { TxType } from '../../../store/interface';

// ============================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface Props {
    hash:string;
}
export class TransactionDetails extends Widget {
    public props:Props;
    public ok:() => void;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init() {
        const tx = fetchLocalTxByHash1(this.props.hash);
        console.log(tx);
        const obj = parseStatusShow(tx);
        this.state = {
            tx,
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
        const tx = this.state.tx;
        if(tx.txType === TxType.RECHARGE){
            popNew('app-view-wallet-cloudWallet-recharge',{ tx,currencyName:this.state.tx.currencyName });
        }else{
            popNew('app-view-wallet-transaction-transfer',{ tx,currencyName:this.state.tx.currencyName });
        }
        
    }

    public copyToAddr() {
        copyToClipboard(this.state.tx.toAddr);
        popNewMessage('复制成功');
    }
    public copyFromAddr() {
        copyToClipboard(this.state.tx.fromAddr);
        popNewMessage('复制成功');
    }
    public copyHash() {
        copyToClipboard(this.state.tx.hash);
        popNewMessage('复制成功');
    }
    public copyEtherscan() {
        copyToClipboard(this.state.qrcode);
        popNewMessage('复制成功');
    }

    public updateTransaction(){
        // this.state.tx = fetchTxByHash(this.props.hash);
        this.init();
        this.paint();
    }
}

//交易记录变化
register('transactions',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateTransaction();
    }
});