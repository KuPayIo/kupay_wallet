/**
 * cloud wallet home
 */
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
// tslint:disable-next-line:max-line-length
import { callFetchBalanceValueOfCoin, callFetchCoinGain,callGetAccountDetail, callGetCloudBalances, callGetRechargeLogs,callGetWithdrawLogs, getStoreData } from '../../../middleLayer/wrap';
import { CloudCurrencyType } from '../../../publicLib/interface';
import { formatBalance, formatBalanceValue } from '../../../publicLib/tools';
import { register } from '../../../store/memstore';
import { getCurrencyUnitSymbol } from '../../../utils/tools';
// ===================================================== 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface Props {
    currencyName:string;
}
export class CloudWalletHome extends Widget {
    public props:any;
    public ok:() => void;
    public language:any;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
        this.paint();
    }
    public init() {
        this.language = this.config.value[getLang()];
        const currencyName = this.props.currencyName;
        this.props = {
            ...this.props,
            topBarTitle:this.props.currencyName,
            tabs:[{
                tab:this.language.total,
                components:'app-view-wallet-cloudWallet-totalRecord'
            },{  
                tab:this.language.other,
                components:'app-view-wallet-cloudWallet-otherRecord'
            },{
                tab:this.language.recharge,
                components:'app-view-wallet-cloudWallet-rechargeRecord'
            },{
                tab:this.language.withdraw,
                components:'app-view-wallet-cloudWallet-withdrawRecord'
            }],
            activeNum:0,
            gain:0,
            rate:formatBalanceValue(0),
            balance:0,
            balanceValue:formatBalanceValue(0),
            currencyUnitSymbol:'',
            redUp: true
        };
        Promise.all([callGetCloudBalances(),callFetchCoinGain(currencyName),
            callFetchBalanceValueOfCoin(currencyName,1),
            getCurrencyUnitSymbol(),
            getStoreData('setting/changeColor','redUp')]).then(([cloudBalances,gain,rate,currencyUnitSymbol,color]) => {
                const balance = formatBalance(cloudBalances.get(CloudCurrencyType[currencyName]));
                const balanceValue = formatBalanceValue(balance * rate);
                this.props.balance = balance;
                this.props.balanceValue = balanceValue;
                this.props.gain = gain;
                this.props.rate = rate;
                this.props.currencyUnitSymbol = currencyUnitSymbol;
                this.props.redUp = color === 'redUp';
                this.paint();
            });
    }

    public updateBalance() {
        const currencyName = this.props.currencyName;
        Promise.all([callGetCloudBalances(),callFetchCoinGain(currencyName),
            callFetchBalanceValueOfCoin(currencyName,1)]).then(([cloudBalances,gain,rate]) => {
                const balance = formatBalance(cloudBalances.get(CloudCurrencyType[currencyName]));
                const balanceValue = formatBalanceValue(balance * rate);
                this.props.balance = balance;
                this.props.balanceValue = balanceValue;
                this.props.gain = gain;
                this.props.rate = rate;
                this.paint();
            });
        
    }
    public tabsChangeClick(event: any, value: number) {
        this.props.activeNum = value;
        this.paint();
    }
    public backPrePage() {
        this.ok && this.ok();
    }
    /**
     * 充值
     */
    public rechargeClick() {
        popNew('app-view-wallet-cloudWallet-recharge',{ currencyName:this.props.currencyName });
    }
    /**
     * 提币
     */
    public withdrawClick() {
        popNew('app-view-wallet-cloudWallet-withdraw',{ currencyName:this.props.currencyName });
    }

    /**
     * 更新事件
     */
    public initEvent() {
        callGetAccountDetail(this.props.currencyName,0);
        callGetRechargeLogs(this.props.currencyName);
        callGetWithdrawLogs(this.props.currencyName);
    }

    public currencyUnitChange() {
        this.props.currencyUnitSymbol = getCurrencyUnitSymbol();
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
