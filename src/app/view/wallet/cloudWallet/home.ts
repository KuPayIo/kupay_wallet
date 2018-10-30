/**
 * cloud wallet home
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getAccountDetail, getRechargeLogs, getWithdrawLogs } from '../../../net/pull';
import { CloudCurrencyType } from '../../../store/interface';
import { getCloudBalances, getStore, register } from '../../../store/memstore';
import { fetchBalanceValueOfCoin, fetchCoinGain, formatBalanceValue, getLanguage, popNewMessage } from '../../../utils/tools';
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
        const balance = getCloudBalances().get(CloudCurrencyType[currencyName]);
        const balanceValue = formatBalanceValue(fetchBalanceValueOfCoin(currencyName,balance));
        const cfg = getLanguage(this); 
        const color = getStore('setting/changeColor','redUp');
        this.state = {
            tabs:[{
                tab:cfg.total,
                components:'app-view-wallet-cloudWallet-totalRecord'
            },{
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
            gain:fetchCoinGain(currencyName),
            rate:formatBalanceValue(fetchBalanceValueOfCoin(currencyName,1)),
            balance,
            balanceValue,
            cfgData:cfg,
            redUp:color ? color.selected === 0 :true
        };
    }

    public updateBalance() {
        const currencyName = this.props.currencyName;
        this.state.balance = getCloudBalances().get(CloudCurrencyType[currencyName]);
        this.state.balanceValue = formatBalanceValue(fetchBalanceValueOfCoin(currencyName,this.state.balance));
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

    /**
     * 更新事件
     */
    public initEvent() {
        getAccountDetail(this.props.currencyName,0);
        getRechargeLogs(this.props.currencyName);
        getWithdrawLogs(this.props.currencyName);
    }

    /**
     * 刷新页面
     */
    public refreshPage() {
        this.initEvent();
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

// 汇率变化
register('USD2CNYRate', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateBalance();
    }
});

// 涨跌幅变化
register('currency2USDTMap', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateBalance();
    }
});