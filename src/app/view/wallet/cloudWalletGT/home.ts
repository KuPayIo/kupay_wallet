/**
 * cloud wallet home
 */
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getAccountDetail, getRechargeLogs, getWithdrawLogs } from '../../../net/pull';
import { CloudCurrencyType } from '../../../store/interface';
import { getCloudBalances, getStore, register } from '../../../store/memstore';
// tslint:disable-next-line:max-line-length
import { fetchBalanceValueOfCoin, fetchCoinGain, formatBalance, formatBalanceValue, getCurrencyUnitSymbol, popNewMessage } from '../../../utils/tools';
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
        const balance = formatBalance(getCloudBalances().get(CloudCurrencyType[currencyName]));
        const balanceValue = formatBalanceValue(fetchBalanceValueOfCoin(currencyName,balance));
        const color = getStore('setting/changeColor','redUp');
        this.state = {
            tabs:[{
                tab:{ zh_Hans:'全部',zh_Hant:'今日',en:'' },
                components:'app-view-wallet-cloudWallet-totalRecord'
            },{
                tab:{ zh_Hans:'入账',zh_Hant:'入賬',en:'' },
                components:'app-view-wallet-cloudWallet-rechargeRecord'
            },{
                tab:{ zh_Hans:'出账',zh_Hant:'出賬',en:'' },
                components:'app-view-wallet-cloudWallet-withdrawRecord'
            }],
            activeNum:0,
            gain:fetchCoinGain(currencyName),
            rate:formatBalanceValue(fetchBalanceValueOfCoin(currencyName,1)),
            balance,
            balanceValue,
            currencyUnitSymbol:getCurrencyUnitSymbol(),
            redUp: color === 'redUp'
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
    /**
     * 充值
     */
    public rechargeClick() {
        // popNew('app-view-wallet-cloudWalletGT-transactionDetails');
        popNew('app-view-wallet-cloudWalletGT-rechargeGT');
    }

    /**
     * 更新事件
     */
    public initEvent() {
        getAccountDetail(this.props.currencyName,0);
        getRechargeLogs(this.props.currencyName);
        getWithdrawLogs(this.props.currencyName);
    }

    public currencyUnitChange() {
        this.state.currencyUnitSymbol = getCurrencyUnitSymbol();
        this.paint();
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
register('cloud/cloudWallets', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateBalance();
    }
});

// 汇率变化
register('third/USD2CNYRate', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateBalance();
    }
});

// 涨跌幅变化
register('third/currency2USDTMap', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateBalance();
    }
});

// 货币单位变化
register('setting/currencyUnit',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.currencyUnitChange();
    }
});
