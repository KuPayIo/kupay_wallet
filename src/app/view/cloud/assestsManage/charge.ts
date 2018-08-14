/**
 * 充值页面
 */
// ==============================================导入
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { getBankAddr, rechargeToServer } from '../../../net/pull';
import { signRawTransactionETH } from '../../../net/pullWallet';
import { find } from '../../../store/store';
import { gasLimit, gasPrice, serviceChargeRate } from '../../../utils/constants';
import { eth2Wei, getCurrentAddrBalanceByCurrencyName, getCurrentAddrByCurrencyName, openBasePage } from '../../../utils/tools';
// ===============================================导出
interface Props {
    currencyName:string;
}
export class Charge extends Widget {
    public ok:() => void;
    constructor() {
        super();
    }
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init(): void {
        this.state = {
            amount:0,// 充值输入值
            serviceCharge:0,// 手续费
            localBalance:getCurrentAddrBalanceByCurrencyName(this.props.currencyName),// 本地余额
            isFeeEnough:false
        };
        this.judgeFeeEnough();
    }
    public backClick() {
        this.ok && this.ok();
    }
    public chargeChange(e:any) {
        this.state.amount = Number(e.value);
        this.state.serviceCharge = this.state.amount * serviceChargeRate;
        this.judgeFeeEnough();
        this.paint();
    }
    public judgeFeeEnough() {
        const amount = this.state.amount;
        const serviceCharge = this.state.serviceCharge;
        const localBalance = this.state.localBalance;
        if ((amount + serviceCharge) > localBalance || serviceCharge === localBalance) {
            this.state.isFeeEnough = false;
        } else {
            this.state.isFeeEnough = true;
        }
    }
    // 充值
    public async rechargeClick() {
        if (this.state.amount <= 0) {
            popNew('app-components-message-message',{ itype:'error',content:'请输入充值数量',center:true });

            return;
        }
        if (!this.state.isFeeEnough) {
            popNew('app-components-message-message',{ itype:'error',content:'余额不足',center:true });

            return;
        }
        const wallet = find('curWallet');
        let passwd;
        if (!find('hashMap',wallet.walletId)) {
            passwd = await openBasePage('app-components-message-messageboxPrompt', {
                title: '输入密码', inputType: 'password'
            });
        }
       
        const close = popNew('pi-components-loading-loading', { text: '地址获取中...' });
        const toAddr = await getBankAddr();
        close.callback(close.widget);
        if (!toAddr) {
            return;
        }
        const close1 = popNew('pi-components-loading-loading', { text: '交易签名中...' });
        const fromAddr = getCurrentAddrByCurrencyName(this.props.currencyName);
        const obj = await signRawTransactionETH(passwd,fromAddr,toAddr,gasPrice,gasLimit,this.state.amount);
        const signedTX = obj.signedTx;
        const hash = obj.hash;
        const nonce = Number(obj.nonce);
        close1.callback(close1.widget);
        rechargeToServer(fromAddr,toAddr,hash,nonce,gasPrice,eth2Wei(this.state.amount));
    }
}