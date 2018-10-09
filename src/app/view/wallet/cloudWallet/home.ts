/**
 * cloud wallet home
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { CurrencyType } from '../../../store/interface';
import { getBorn, register } from '../../../store/store';
import { formatBalanceValue, getLanguage, popNewMessage } from '../../../utils/tools';
// ===================================================== 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface Props {
    currencyName:string;
}
export class CloudWalletHome extends Widget {
    public props:Props;
    public ok:() => void;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init() {
        const currencyName = this.props.currencyName;
        const rate =   getBorn('exchangeRateJson').get(currencyName).CNY;
        const balance = getBorn('cloudBalance').get(CurrencyType[currencyName]);
        const balanceValue = formatBalanceValue(rate * balance);
        const cfg = getLanguage(this); 
        this.state = {
            tabs:[{
                tab:cfg.other,
                components:'app-view-wallet-cloudWallet-otherRecord'
            },{
                tab:cfg.recharge,
                components:'app-view-wallet-cloudWallet-rechargeRecord'
            },{
                tab:cfg.withdraw,
                components:'app-view-wallet-cloudWallet-withdrawRecord'
            }],
            activeNum:0,
            gain:getBorn('coinGain').get(currencyName) || formatBalanceValue(0),
            rate:formatBalanceValue(rate),
            balance,
            balanceValue,
            cfgData:cfg
        };
    }

    public updateBalance() {
        const currencyName = this.props.currencyName;
        this.state.balance = getBorn('cloudBalance').get(CurrencyType[currencyName]);
        this.state.balanceValue = formatBalanceValue(this.state.rate * this.state.balance);
        this.paint();
    }
    public tabsChangeClick(event: any, value: number) {
        this.state.activeNum = value;
        this.paint();
    }
    public backPrePage() {
        this.ok && this.ok();
    }
    public rechargeClick() {
        if (this.props.currencyName === 'KT' || this.props.currencyName === 'CNYT') {
            popNewMessage(this.state.cfgData.tips);

            return;
        }
        popNew('app-view-wallet-cloudWallet-recharge',{ currencyName:this.props.currencyName });
    }
    public withdrawClick() {
        if (this.props.currencyName === 'KT' || this.props.currencyName === 'CNYT') {
            popNewMessage(this.state.cfgData.tips);

            return;
        }
        popNew('app-view-wallet-cloudWallet-withdraw',{ currencyName:this.props.currencyName });
    }
}

// ===========================

// 余额变化
register('cloudBalance', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateBalance();
    }
});