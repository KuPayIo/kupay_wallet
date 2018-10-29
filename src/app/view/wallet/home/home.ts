/**
 * wallet home 
 */
// ==============================导入
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getServerCloudBalance } from '../../../net/pull';
import { register } from '../../../store/memstore';
// tslint:disable-next-line:max-line-length
import { fetchCloudTotalAssets, fetchLocalTotalAssets, formatBalanceValue, getCurrencyUnitSymbol, getLanguage, getUserInfo } from '../../../utils/tools';
// ============================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
declare var pi_modules : any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class Home extends Widget {
    public create() {
        super.create();
        this.init();
    }
    public init() {
        const userInfo = getUserInfo();
        const cfg = getLanguage(this);
        this.state = {
            tabs:[{
                tab:cfg.tabs[0],
                components:'app-view-wallet-home-cloudHome'
            },{
                tab:cfg.tabs[1],
                components:'app-view-wallet-home-walletHome'
            }],
            activeNum:1,
            avatar:userInfo && userInfo.avatar,
            totalAsset:formatBalanceValue(fetchLocalTotalAssets() + fetchCloudTotalAssets()),
            cfgData:cfg,
            refreshing:false,
            currencyUnitSymbol:getCurrencyUnitSymbol()
        };
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

    /**
     * 打开我的设置
     */
    public showMine() {
        popNew('app-view-mine-home-home');
    }

    public refreshClick() {
        if (this.state.refreshing) {
            return;
        }
        this.state.refreshing = true;
        this.paint();
        let neededRefreshCount = 1;
        getServerCloudBalance().then(() => {
            neededRefreshCount--;
            if (neededRefreshCount === 0) {
                this.state.refreshing = false;
                this.paint();
            }
        }).catch(() => {
            neededRefreshCount--;
            if (neededRefreshCount === 0) {
                this.state.refreshing = false;
                this.paint();
            }
        });
        // 从缓存中获取地址进行初始化
        const addrs = find('addrs') || [];
        if (addrs) {
            const wallet = find('curWallet');
            if (!wallet) return;
            let list = [];
            wallet.currencyRecords.forEach(v => {
                if (wallet.showCurrencys.indexOf(v.currencyName) >= 0) {
                    list = list.concat(v.addrs);
                }
            });
            const dataCenter = pi_modules.commonjs.exports.relativeGet('app/logic/dataCenter').exports.dataCenter;
            addrs.forEach(v => {
                if (list.indexOf(v.addr) >= 0 && wallet.showCurrencys.indexOf(v.currencyName) >= 0) {
                    neededRefreshCount++;
                    dataCenter.updateBalance(v.addr, v.currencyName).then(() => {
                        neededRefreshCount--;
                        if (neededRefreshCount === 0) {
                            this.state.refreshing = false;
                            this.paint();
                        }
                    });
                }
            });
        }
    }
}

// ==========================本地
register('userInfo',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.userInfoChange();
    }
});

// 云端余额变化
register('cloudBalance',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateTotalAsset();
    }
});

register('setting', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
        w.paint();
    }
});

// 货币涨跌幅度变化
register('third/currency2USDTMap',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateTotalAsset();
    }
});
