/**
 * 确认购买
 */
// ===============================================导入
import { Widget } from '../../../../pi/widget/widget';
import { Product, CurrencyType, TransRecordLocal, TxStatus, MinerFeeLevel, TxType } from '../../../store/interface';
import { formatBalance, popPswBox, hasWallet, getCurrentAddrBalanceByCurrencyName, popNewMessage, getCurrentAddrByCurrencyName, fetchGasPrice } from '../../../utils/tools';
import { purchaseProduct } from '../../../utils/walletTools';
import { getBorn } from '../../../store/store';
import { recharge } from '../../../net/pullWallet';
import { defaultGasLimit } from '../../../utils/constants';
import { wei2Eth } from '../../../utils/unitTools';
// ==================================================导出
interface Props{
    product:Product;
    amount:number;
}
export class ProductDetail extends Widget {
    public props:Props;
    public ok: () => void;
    constructor() {
        super();
    }
    public setProps(props: Props, oldProps: Props) {
        super.setProps(props,oldProps);
        console.log(props);
        this.init();
    }
    public init() {
        const spend = formatBalance(this.props.product.unitPrice * this.props.amount);
        const cloudBalance = getBorn('cloudBalance').get(CurrencyType['ETH']);
        const localBalance = getCurrentAddrBalanceByCurrencyName('ETH');
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
        if(!psw) return;
        if(this.state.cloudBalance >= this.state.spend){
            purchaseProduct(psw,this.props.product.id,this.props.amount);
        }else if(this.state.cloudBalance + this.state.localBalance >= this.state.spend){
            const fromAddr = getCurrentAddrByCurrencyName('ETH');
            const pay = this.state.spend - this.state.cloudBalance;
            const tx:TransRecordLocal = {
                hash:"",
                txType:TxType.RECHARGE,
                fromAddr,
                toAddr: "",
                pay,
                time: new Date().getTime(),
                status:TxStatus.PENDING,
                confirmedBlockNumber: 0,
                needConfirmedBlockNumber:0,
                info: '',
                currencyName: 'ETH',
                fee: wei2Eth(defaultGasLimit * fetchGasPrice(MinerFeeLevel.STANDARD)),
                nonce:0,
                minerFeeLevel:MinerFeeLevel.STANDARD,
                addr:fromAddr
            };
            recharge(psw,tx);
        }else{
            popNewMessage('余额不足');
        }
        this.ok && this.ok();
    }
}