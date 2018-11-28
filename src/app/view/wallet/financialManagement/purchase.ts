/**
 * 确认购买
 */
// ===============================================导入
import { getLang } from '../../../../pi/util/lang';
import { Widget } from '../../../../pi/widget/widget';
import { recharge } from '../../../net/pullWallet';
import { CloudCurrencyType, MinerFeeLevel, Product, TxHistory, TxStatus, TxType } from '../../../store/interface';
import { getCloudBalances } from '../../../store/memstore';
import { defaultGasLimit } from '../../../utils/constants';
import { fetchGasPrice, formatBalance, getCurrentAddrByCurrencyName, getCurrentAddrInfo, popNewMessage, popPswBox } from '../../../utils/tools';
import { wei2Eth } from '../../../utils/unitTools';
import { purchaseProduct } from '../../../utils/walletTools';
import { forelet,WIDGET_NAME } from './productDetail';
// ==================================================导出
interface Props {
    product:Product;
    amount:number;
}
export class ProductDetail extends Widget {
    public props:Props;
    public ok: () => void;
    public language:any;
    constructor() {
        super();
    }
    public setProps(props: Props, oldProps: Props) {
        super.setProps(props,oldProps);
        console.log(props);
        this.init();
    }
    public init() {
        this.language = this.config.value[getLang()];
        const spend = formatBalance(this.props.product.unitPrice * this.props.amount);
        const cloudBalance = getCloudBalances().get(CloudCurrencyType.ETH);
        const localBalance = getCurrentAddrInfo('ETH').balance;
        this.state = {
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
        if (this.state.cloudBalance >= this.state.spend) {
            const success = await purchaseProduct(psw,this.props.product.id,this.props.amount);
            if (success) {
                const w: any = forelet.getWidget(WIDGET_NAME);
                w.ok && w.ok();
            }
        } else if (this.state.cloudBalance + this.state.localBalance >= this.state.spend) {
            const fromAddr = getCurrentAddrByCurrencyName('ETH');
            const pay = this.state.spend - this.state.cloudBalance;
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
                fee: wei2Eth(defaultGasLimit * fetchGasPrice(MinerFeeLevel.Standard)),
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
            popNewMessage(this.language.tips);
        }
        this.ok && this.ok();
    }
}