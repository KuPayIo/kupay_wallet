/**
 * 确认购买
 */
// ===============================================导入
import { getLang } from '../../../../pi/util/lang';
import { Widget } from '../../../../pi/widget/widget';
import { purchaseProduct } from '../../../logic/localWallet';
import { callFetchGasPrice } from '../../../middleLayer/walletBridge';
import { CloudCurrencyType, MinerFeeLevel, Product, TxHistory, TxStatus, TxType } from '../../../store/interface';
import { getCloudBalances } from '../../../store/memstore';
import { defaultGasLimit } from '../../../utils/constants';
// tslint:disable-next-line:max-line-length
import { formatBalance, getCurrentAddrByCurrencyName, getCurrentAddrInfo, popNewMessage, popPswBox } from '../../../utils/tools';
import { wei2Eth } from '../../../utils/unitTools';
import { forelet,WIDGET_NAME } from './productDetail';
// ==================================================导出
interface Props {
    product:Product;
    amount:number;
}
export class ProductDetail extends Widget {
    public props:any;
    public ok: () => void;
    constructor() {
        super();
    }
    public setProps(props: Props, oldProps: Props) {
        super.setProps(props,oldProps);
        // console.log(props);
        this.init();
    }
    public init() {
        const spend = formatBalance(this.props.product.unitPrice * this.props.amount);
        const cloudBalance = getCloudBalances().get(CloudCurrencyType.ETH);
        const localBalance = getCurrentAddrInfo('ETH').balance;
        this.props = {
            ...this.props,
            spend,
            cloudBalance,
            localBalance
        }; 
    }
    public close() {
        this.ok && this.ok();
    }
    public async purchaseClicked() {
        const psw = await popPswBox();
        if (!psw) return;
        if (this.props.cloudBalance >= this.props.spend) {
            const success = await purchaseProduct(psw,this.props.product.id,this.props.amount);
            if (success) {
                const w: any = forelet.getWidget(WIDGET_NAME);
                w.ok && w.ok();
            }
        } else if (this.props.cloudBalance + this.props.localBalance >= this.props.spend) {
            const fromAddr = getCurrentAddrByCurrencyName('ETH');
            const pay = this.props.spend - this.props.cloudBalance;
            const gasPrice = await callFetchGasPrice(MinerFeeLevel.Standard);
            const tx:TxHistory = {
                hash:'',
                txType:TxType.Recharge,
                fromAddr,
                toAddr: '',
                pay,
                time: new Date().getTime(),
                status:TxStatus.Pending,
                confirmedBlockNumber: 0,
                needConfirmedBlockNumber:0,
                info: '',
                currencyName: 'ETH',
                fee: wei2Eth(defaultGasLimit * gasPrice),
                nonce:0,
                minerFeeLevel:MinerFeeLevel.Standard,
                addr:fromAddr
            };
            const h = await recharge(psw,tx);
            if (h) {
                const w: any = forelet.getWidget(WIDGET_NAME);
                w.ok && w.ok();
            }
        } else {
            const tips = { zh_Hans:'余额不足',zh_Hant:'餘額不足',en:'' };
            popNewMessage(tips[getLang()]);
        }
        this.ok && this.ok();
    }
}