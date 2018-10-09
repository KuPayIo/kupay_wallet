/**
 * 交易详情页面
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { openNewActivity } from '../../../logic/native';
import { TxType } from '../../../store/interface';
import { register } from '../../../store/store';
import { blockchainUrl, etherscanUrl } from '../../../utils/constants';
// tslint:disable-next-line:max-line-length
import { canResend, copyToClipboard, getLanguage, parseAccount, parseStatusShow, popNewMessage, timestampFormat } from '../../../utils/tools';
import { fetchLocalTxByHash1 } from '../../../utils/walletTools';

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
        const cfg = getLanguage(this);
        const qrcodePrefix = tx.currencyName === 'BTC' ?  blockchainUrl : etherscanUrl;
        const webText = tx.currencyName === 'BTC' ? cfg.tips[0] : cfg.tips[1];
        this.state = {
            tx,
            hashShow:parseAccount(tx.hash),
            timeShow:timestampFormat(tx.time),
            statusShow:obj.text,
            statusIcon:obj.icon,
            minerFeeUnit:tx.currencyName !== 'BTC' ? 'ETH' : 'BTC',
            canResend:canResend(tx),
            qrcode:`${qrcodePrefix}${tx.hash}`,
            webText,
            cfgData:cfg
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }

    public resendClick() {
        const tx = this.state.tx;
        if (tx.txType === TxType.RECHARGE) {
            popNew('app-view-wallet-cloudWallet-recharge',{ tx,currencyName:this.state.tx.currencyName });
        } else {
            popNew('app-view-wallet-transaction-transfer',{ tx,currencyName:this.state.tx.currencyName });
        }
        this.ok && this.ok();
    }

    public copyToAddr() {
        copyToClipboard(this.state.tx.toAddr);
        popNewMessage(this.state.cfgData.tips[2]);
    }
    public copyFromAddr() {
        copyToClipboard(this.state.tx.fromAddr);
        popNewMessage(this.state.cfgData.tips[2]);
    }
    public copyHash() {
        copyToClipboard(this.state.tx.hash);
        popNewMessage(this.state.cfgData.tips[2]);
    }
    public openNewWeb() {
        const title = this.state.tx.currencyName === 'BTC' ? 'Blockchain' : 'Etherscan';
        openNewActivity(this.state.qrcode,title);
    }

    public updateTransaction() {
        // this.state.tx = fetchTxByHash(this.props.hash);
        this.init();
        this.paint();
    }
}

// 交易记录变化
register('transactions',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateTransaction();
    }
});