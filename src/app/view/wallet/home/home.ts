/**
 * wallet home 
 */
// ==============================导入
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { register, find } from '../../../store/store';
import { fetchCloudTotalAssets, fetchTotalAssets, formatBalanceValue, getLanguage, getUserInfo } from '../../../utils/tools';
import { getCloudBalance } from '../../../net/pull';
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
            totalAsset:formatBalanceValue(fetchTotalAssets() + fetchCloudTotalAssets()),
            cfgData:cfg,
            refreshing:false
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
        this.state.totalAsset = formatBalanceValue(fetchTotalAssets() + fetchCloudTotalAssets());
        this.paint();
    }

    /**
     * 打开我的设置
     */
    public showMine() {
        popNew('app-view-mine-home-home');
    }

    public refreshClick(){
        if(this.state.refreshing){
            return;
        }
        this.state.refreshing = true;
        this.paint();
        let neededRefreshCount = 1;
        getCloudBalance().then(()=>{
            neededRefreshCount--;
            if(neededRefreshCount === 0){
                this.state.refreshing = false;
                this.paint();
            }
        }).catch(()=>{
            neededRefreshCount--;
            if(neededRefreshCount === 0){
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
                    dataCenter.updateBalance(v.addr, v.currencyName).then(()=>{
                        neededRefreshCount--;
                        if(neededRefreshCount === 0){
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

// 汇率变化
register('exchangeRateJson',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateTotalAsset();
    }
});

// 云端余额变化
register('cloudBalance',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateTotalAsset();
    }
});

register('languageSet', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
    }
});