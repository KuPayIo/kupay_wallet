/**
 * ST 交易记录主页
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getModulConfig } from '../../../modulConfig';
import { getAccountDetail } from '../../../net/pull';
import { CloudCurrencyType } from '../../../store/interface';
import { getCloudBalances, getStore, register } from '../../../store/memstore';
// tslint:disable-next-line:max-line-length
import { fetchBalanceValueOfCoin, fetchGTGain, formatBalance, formatBalanceValue, getCurrencyUnitSymbol } from '../../../utils/tools';
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
    public setProps(props:Props,oldProps:Props) {

        super.setProps(props,oldProps);
        this.init();
    }
    public init() {
        const currencyName = this.props.currencyName;
        const balance = formatBalance(getCloudBalances().get(CloudCurrencyType[currencyName]));
        const balanceValue = formatBalanceValue(fetchBalanceValueOfCoin('ST',balance));
        const color = getStore('setting/changeColor','redUp');
        const stShow = getModulConfig('ST_SHOW');
        this.props = {
            ...this.props,
            stShow,
            tabs:[{
                tab:{ zh_Hans:'全部',zh_Hant:'全部',en:'' },
                components:'app-view-wallet-cloudWalletGT-totalRecord'
            },{
                tab:{ zh_Hans:'入账',zh_Hant:'入賬',en:'' },
                components:'app-view-wallet-cloudWalletGT-rechargeRecord'
            },{
                tab:{ zh_Hans:'出账',zh_Hant:'出賬',en:'' },
                components:'app-view-wallet-cloudWalletGT-withdrawRecord'
            }],
            activeNum:0,
            gain:fetchGTGain(),
            rate:formatBalanceValue(fetchBalanceValueOfCoin('ST',1)),
            balance,
            balanceValue,
            currencyUnitSymbol:getCurrencyUnitSymbol(),
            redUp: color === 'redUp'
        };
    }

    public updateBalance() {
        const currencyName = this.props.currencyName;
        this.props.balance = getCloudBalances().get(CloudCurrencyType[currencyName]);
        this.props.balanceValue = formatBalanceValue(fetchBalanceValueOfCoin('ST',this.props.balance));
        this.props.gain = fetchGTGain();
        this.props.rate = formatBalanceValue(fetchBalanceValueOfCoin('ST',1));
        this.paint();
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
        // popNew('app-view-wallet-cloudWalletGT-transactionDetails',{ oid:'100' });
        popNew('app-view-wallet-cloudWalletGT-rechargeGT');
    }

    /**
     * 更新事件
     */
    public initEvent() {
        getAccountDetail(this.props.currencyName,0);
        // getRechargeLogs(this.props.currencyName);
        // getWithdrawLogs(this.props.currencyName);
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

// 金价变化
register('third/silver', () => {
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
