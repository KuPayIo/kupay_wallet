/**
 * SC 交易记录主页
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { callGetCloudBalances, getStoreData } from '../../../middleLayer/memBridge';
import { callGetAccountDetail } from '../../../middleLayer/netBridge';
import { callFetchBalanceValueOfCoin } from '../../../middleLayer/toolsBridge';
import { CloudCurrencyType } from '../../../publicLib/interface';
import { getModulConfig } from '../../../publicLib/modulConfig';
import { fetchCloudGain, formatBalance, formatBalanceValue } from '../../../publicLib/tools';
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
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init() {
        const currencyName = this.props.currencyName;
        const titleShow = currencyName === CloudCurrencyType[CloudCurrencyType.SC] ? getModulConfig('SC_SHOW') : getModulConfig('KT_SHOW');
        this.props = {
            ...this.props,
            titleShow,
            tabs:[{
                tab:{ zh_Hans:'全部',zh_Hant:'全部',en:'' },
                components:'app-view-wallet-cloudWalletCustomize-totalRecord'
            },{
                tab:{ zh_Hans:'入账',zh_Hant:'入賬',en:'' },
                components:'app-view-wallet-cloudWalletCustomize-accountEntry'
            },{
                tab:{ zh_Hans:'出账',zh_Hant:'出賬',en:'' },
                components:'app-view-wallet-cloudWalletCustomize-accountOut'
            }],
            activeNum:0,
            gain:fetchCloudGain(),
            rate:formatBalanceValue(0),
            balance:0,
            balanceValue:formatBalanceValue(0),
            currencyUnitSymbol:getCurrencyUnitSymbol(),
            redUp: true
        };

        Promise.all([callGetCloudBalances(),callFetchBalanceValueOfCoin(currencyName,1),
            getCurrencyUnitSymbol(),getStoreData('setting/changeColor','redUp')]).then(([cloudBalances,rate,currencyUnitSymbol,color]) => {
                const balance = formatBalance(cloudBalances.get(CloudCurrencyType[currencyName]));
                const balanceValue = formatBalanceValue(balance * rate);
                this.props.balance = balance;
                this.props.balanceValue = balanceValue;
                this.props.rate = rate;
                this.props.currencyUnitSymbol = currencyUnitSymbol;
                this.props.redUp = color === 'redUp';
                this.paint();
            });
    }

    public updateBalance() {
        const currencyName = this.props.currencyName;
        Promise.all([callGetCloudBalances(),callFetchBalanceValueOfCoin(currencyName,1)]).then(([cloudBalances,rate]) => {
            const balance = formatBalance(cloudBalances.get(CloudCurrencyType[currencyName]));
            const balanceValue = formatBalanceValue(balance * rate);
            this.props.balance = balance;
            this.props.balanceValue = balanceValue;
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
        popNew('app-view-wallet-cloudWalletCustomize-rechargeSC');
    }

    /**
     * 更新事件
     */
    public initEvent() {
        callGetAccountDetail(this.props.currencyName,0);
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
