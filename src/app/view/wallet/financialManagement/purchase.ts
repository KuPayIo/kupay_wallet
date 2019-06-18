/**
 * 确认购买
 */
// ===============================================导入
import { getLang } from '../../../../pi/util/lang';
import { Widget } from '../../../../pi/widget/widget';
import { callGetCloudBalances } from '../../../middleLayer/memBridge';
import { callFetchGasPrice, callGetCurrentAddrInfo } from '../../../middleLayer/walletBridge';
import { defaultGasLimit } from '../../../publicLib/config';
import { CloudCurrencyType, MinerFeeLevel, Product, TxHistory, TxStatus, TxType } from '../../../publicLib/interface';
import { formatBalance } from '../../../publicLib/tools';
import { wei2Eth } from '../../../publicLib/unitTools';
import { popNewMessage, popPswBox } from '../../../utils/tools';
import { purchaseProduct, recharge } from '../../../viewLogic/localWallet';
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
        this.props = {
            ...this.props,
            spend,
            cloudBalance:0,
            localBalance:0
        }; 
        Promise.all([callGetCurrentAddrInfo('ETH'),callGetCloudBalances()]).then(([addrInfo,cloudBalances]) => {
            this.props.cloudBalance = cloudBalances.get(CloudCurrencyType.ETH);
            this.props.localBalance = addrInfo.balance;
            this.paint();
        });
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
            const addrInfo = await callGetCurrentAddrInfo('ETH');
            const fromAddr = addrInfo.addr;
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