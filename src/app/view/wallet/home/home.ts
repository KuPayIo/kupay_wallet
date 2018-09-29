/**
 * wallet home 
 */
// ==============================导入
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { register } from '../../../store/store';
import { fetchCloudTotalAssets, fetchTotalAssets, formatBalanceValue, getLanguage, getUserInfo } from '../../../utils/tools';
// ============================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
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
            cfgData:cfg
        };
    }
    public tabsChangeClick(event: any, value: number) {
        this.state.activeNum = value;
        this.paint();
    }

    public userInfoChange() {
        const userInfo = getUserInfo();
        if(!userInfo) return;
        this.state.avatar = userInfo.avatar;
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