/**
 * 提现界面
 */
// ==================================================导入
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { getWithdrawLogs, withdrawFromServer } from '../../../net/pull';
import { CurrencyType } from '../../../store/interface';
import { find } from '../../../store/store';
import { withdrawServiceCharge } from '../../../utils/constants';
import { eth2Wei, getCurrentAddrByCurrencyName, openBasePage, VerifyIdentidy } from '../../../utils/tools';
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
            amount:0,// 提币金额
            serviceCharge:0,// 手续费
            cloudBalance:find('cloudBalance',CurrencyType[this.props.currencyName]),// 可提金额
            isFeeEnough:true
        };
    }
    public backClick() {
        this.ok && this.ok();
    }
    public amountChange(e:any) {
        this.state.amount = Number(e.value);
        this.state.serviceCharge = this.state.amount * withdrawServiceCharge;
        this.judgeFeeEnough();
        this.paint();
    }
    public judgeFeeEnough() {
        const amount = this.state.amount;
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
        if (this.state.amount <= 0) {
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
            passwd = await openBasePage('app-components-message-messageboxPrompt', {
                title: '输入密码', inputType: 'password'
            });
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
        } else {
            popNew('app-components-message-message',{ itype:'error',content:'出错啦',center:true });
        }
        getWithdrawLogs();
        this.ok && this.ok();
    }
}