/**
 * wallet home 
 */
// ==============================导入
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getServerCloudBalance } from '../../../net/pull';
import { getStore, register } from '../../../store/memstore';
// tslint:disable-next-line:max-line-length
import { fetchCloudTotalAssets, fetchLocalTotalAssets, formatBalanceValue, getCurrencyUnitSymbol, getUserInfo } from '../../../utils/tools';
import { getLang } from '../../../../pi/util/lang';
// ============================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
declare var pi_modules : any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class Home extends Widget {
    public language:any;
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.language = this.config.value[getLang()];
        const userInfo = getUserInfo();
        this.state = {
            tabs:[{
                tab:this.language.tabs[0],
                components:'app-view-wallet-home-cloudHome'
            },{
                tab:this.language.tabs[1],
                components:'app-view-wallet-home-walletHome'
            }],
            activeNum:1,
            avatar:userInfo && userInfo.avatar,
            totalAsset:formatBalanceValue(fetchLocalTotalAssets() + fetchCloudTotalAssets()),
            refreshing:false,
            currencyUnitSymbol:getCurrencyUnitSymbol()
        };
        this.paint();
    }
    public tabsChangeClick(event: any, value: number) {
        this.state.activeNum = value;
        this.paint();
    }

    public userInfoChange() {
        const userInfo = getUserInfo();
        this.state.avatar = userInfo.avatar || '';
        this.paint();
    }

    public updateTotalAsset() {
        this.state.totalAsset = formatBalanceValue(fetchLocalTotalAssets() + fetchCloudTotalAssets());
        this.paint();
    }

    public currencyUnitChange() {
        this.state.totalAsset = formatBalanceValue(fetchLocalTotalAssets() + fetchCloudTotalAssets());
        this.state.currencyUnitSymbol = getCurrencyUnitSymbol();
        this.paint();
    }

    public refreshClick() {
        if (this.state.refreshing) {
            return;
        }
        this.state.refreshing = true;
        this.paint();
        setTimeout(() => {
            this.state.refreshing = false;
            this.paint();
        },1000);
        getServerCloudBalance();
        const wallet = getStore('wallet');
        if (!wallet) return;
        const list = [];
        wallet.currencyRecords.forEach(v => {
            if (wallet.showCurrencys.indexOf(v.currencyName) >= 0) {
                v.addrs.forEach(addrInfo => {
                    list.push({ addr: addrInfo.addr, currencyName: v.currencyName });
                });
                
            }
        });
       
        const dataCenter = pi_modules.commonjs.exports.relativeGet('app/logic/dataCenter').exports.dataCenter;
        list.forEach(v => {
            dataCenter.updateBalance(v.addr, v.currencyName);
        });
    }
}

// ==========================本地
register('user',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
    }
});

register('user/info',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.userInfoChange();
    }
});

// 云端余额变化
register('cloud/cloudWallet',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateTotalAsset();
    }
});

register('setting/language', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
    }
});

// 货币涨跌幅度变化
register('third/currency2USDTMap',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateTotalAsset();
    }
});
// 货币单位变化
register('setting/currencyUnit',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.currencyUnitChange();
    }
});