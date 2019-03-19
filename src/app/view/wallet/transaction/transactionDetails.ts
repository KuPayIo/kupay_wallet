/**
 * 交易详情页面
 */
import { ShareToPlatforms, ShareType } from '../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { openNewActivity } from '../../../logic/native';
import { TxType } from '../../../store/interface';
import { register } from '../../../store/memstore';
import { blockchainUrl, etherscanUrl } from '../../../utils/constants';
// tslint:disable-next-line:max-line-length
import { canResend, copyToClipboard, parseAccount, parseStatusShow, popNewMessage, timestampFormat } from '../../../utils/tools';
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
    public props:any;
    public ok:() => void;
    public language:any;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init() {
        this.language = this.config.value[getLang()];
        const tx = fetchLocalTxByHash1(this.props.hash);
        console.log(`transactionDetails tx is `,tx);
        const obj = parseStatusShow(tx);
        const qrcodePrefix = tx.currencyName === 'BTC' ?  blockchainUrl : etherscanUrl;
        const webText = tx.currencyName === 'BTC' ? this.language.tips[0] : this.language.tips[1];
        this.props = {
            ...this.props,
            tx,
            hashShow:parseAccount(tx.hash),
            timeShow:timestampFormat(tx.time),
            statusShow:obj.text,
            statusIcon:obj.icon,
            minerFeeUnit:tx.currencyName !== 'BTC' ? 'ETH' : 'BTC',
            canResend:canResend(tx),
            qrcode:`${qrcodePrefix}${tx.hash}`,
            webText
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }

    public resendClick() {
        const tx = this.props.tx;
        if (tx.txType === TxType.Recharge) {
            popNew('app-view-wallet-cloudWallet-recharge',{ tx,currencyName:this.props.tx.currencyName });
        } else {
            popNew('app-view-wallet-transaction-transfer',{ tx,currencyName:this.props.tx.currencyName });
        }
        this.ok && this.ok();
    }

    public copyToAddr() {
        copyToClipboard(this.props.tx.toAddr);
        popNewMessage(this.language.tips[2]);
    }
    public copyFromAddr() {
        copyToClipboard(this.props.tx.fromAddr);
        popNewMessage(this.language.tips[2]);
    }
    public copyHash() {
        copyToClipboard(this.props.tx.hash);
        popNewMessage(this.language.tips[2]);
    }
    public openNewWeb() {
        popNew('app-components-openLink-openLink',{},() => {
            const title = this.props.tx.currencyName === 'BTC' ? 'Blockchain' : 'Etherscan';
            openNewActivity(this.props.qrcode,title);
        });
    }

    public updateTransaction() {
        // this.props.tx = fetchTxByHash(this.props.hash);
        this.init();
        this.paint();
    }

    /**
     * 分享截图
     */
    public shareScreen() {
        const stp = new ShareToPlatforms();
        stp.init();
        stp.makeScreenShot({
            success: (result) => { 
                popNew('app-components-share-share',{ shareType:ShareType.TYPE_SCREEN });
            },
            fail: (result) => { 
                popNewMessage(this.language.shareScreen);
            }
        });
    }
}

// 交易记录变化
register('wallet/currencyRecords',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateTransaction();
    }
});