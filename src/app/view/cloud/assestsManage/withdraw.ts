/**
 * 提现界面
 */
// ==================================================导入
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { eth2Wei, wei2Eth } from '../../../core/globalWallet';
import { getCloudBalance, getWithdrawLogs, withdrawFromServer } from '../../../net/pull';
import { CurrencyType } from '../../../store/interface';
import { find } from '../../../store/store';
import { gasLimit, gasPrice } from '../../../utils/constants';
import { getCurrentAddrByCurrencyName, popPswBox, VerifyIdentidy } from '../../../utils/tools';
// =================================================导出

interface Props {
    currencyName:string;
}
export class Withdraw extends Widget {
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
            amount:'',// 提币金额
            serviceCharge:wei2Eth(gasLimit * gasPrice),// 手续费
            cloudBalance:find('cloudBalance',CurrencyType[this.props.currencyName]),// 可提金额
            isFeeEnough:true
        };
    }
    public backClick() {
        this.ok && this.ok();
    }
    public amountChange(e:any) {
        this.state.amount = e.value;
        this.judgeFeeEnough();
        this.paint();
    }
    public judgeFeeEnough() {
        const amount = Number(this.state.amount);
        const serviceCharge = this.state.serviceCharge;
        const cloudBalance = this.state.cloudBalance;
        if ((amount + serviceCharge) > cloudBalance) {
            this.state.isFeeEnough = false;
        } else {

            this.state.isFeeEnough = true;
        }
    }
    // 提现
    public async withdrawClick() {
        if (Number(this.state.amount) <= 0) {
            popNew('app-components-message-message',{ itype:'error',content:'请输入提现金额',center:true });

            return;
        }
        if (!this.state.isFeeEnough) {
            popNew('app-components-message-message',{ itype:'error',content:'余额不足',center:true });

            return;
        }
        
        const wallet = find('curWallet');
        let passwd;
        if (!find('hashMap',wallet.walletId)) {
            passwd = await popPswBox();
            if (!passwd) return;
        }
        const close = popNew('pi-components-loading-loading', { text: '正在提现...' });
        const verify = await VerifyIdentidy(wallet,passwd);
        if (!verify) {
            close.callback(close.widget);
            popNew('app-components-message-message',{ itype:'error',content:'密码错误',center:true });

            return;
        }
        const toAddr = getCurrentAddrByCurrencyName(this.props.currencyName);
        const coin = Number(CurrencyType[this.props.currencyName]);
        const success = await withdrawFromServer(toAddr,coin,eth2Wei(this.state.amount));
        close.callback(close.widget);
        if (success) {
            popNew('app-components-message-message',{ itype:'success',content:'提现成功',center:true });
        }
        getWithdrawLogs();
        getCloudBalance();
        this.ok && this.ok();
    }
}