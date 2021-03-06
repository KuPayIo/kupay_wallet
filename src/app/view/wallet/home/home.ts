/**
 * wallet home 
 */
// ==============================导入
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { OfflienType } from '../../../components1/offlineTip/offlineTip';
import { getServerCloudBalance } from '../../../net/pull';
import { getStore, register } from '../../../store/memstore';
import { getDataCenter } from '../../../utils/commonjsTools';
// tslint:disable-next-line:max-line-length
import { fetchCloudTotalAssets, fetchLocalTotalAssets, formatBalanceValue, getCurrencyUnitSymbol, getUserInfo } from '../../../utils/tools';
// ============================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class Home extends Widget {
    public setProps(props:any,oldProps:any) {
        super.setProps(props,oldProps);
        this.pageInit();
        this.dataInit();
    }
    public pageInit() {
        this.props = {
            offlienType:OfflienType.WALLET,
            tabs:[{
                tab:{ zh_Hans:'云账户',zh_Hant:'雲賬戶',en:'' },
                components:'app-view-wallet-home-cloudHome'
            },{
                tab:{ zh_Hans:'本地钱包',zh_Hant:'本地錢包',en:'' },
                components:'app-view-wallet-home-walletHome'
            }],
            activeNum:0,
            refreshing:false,
            avatar:'',
            totalAsset:'',
            currencyUnitSymbol:''
        };
        this.paint();
        // console.log('updateTest');
    }

    public dataInit() {
        const userInfo = getUserInfo();
        this.props.avatar = userInfo && userInfo.avatar;
        this.props.totalAsset = formatBalanceValue(fetchLocalTotalAssets() + fetchCloudTotalAssets());
        this.props.currencyUnitSymbol = getCurrencyUnitSymbol(); 
        this.paint();
    }

    public tabsChangeClick(event: any, value: number) {
        this.props.activeNum = value;
        this.paint();
    }

    public userInfoChange() {
        const userInfo = getUserInfo();
        this.props.avatar = userInfo.avatar || '';
        this.paint();
    }

    public updateTotalAsset() {
        this.props.totalAsset = formatBalanceValue(fetchLocalTotalAssets() + fetchCloudTotalAssets());
        this.paint();
    }

    public currencyUnitChange() {
        this.props.totalAsset = formatBalanceValue(fetchLocalTotalAssets() + fetchCloudTotalAssets());
        this.props.currencyUnitSymbol = getCurrencyUnitSymbol();
        this.paint();
    }
    /**
     *  刷新页面
    */
    public loaded() {
        // toDo 更新数据 完成之后将loaded变成true 刷新页面
        setTimeout(() => {
            // 加载数据完成
            this.props.loaded = true;
            this.paint();

        },2000);

    }
    /**
     * 刷新前的准备
     */
    public beforeLoad() {
        // '通知刷新状态---'
        this.props.loaded = false;
        this.paint();
    }

    public refreshClick() {
        if (this.props.refreshing) {
            return;
        }
        this.props.refreshing = true;
        this.paint();
        setTimeout(() => {
            this.props.refreshing = false;
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
       
        getDataCenter().then(dataCenter => {
            list.forEach(v => {
                dataCenter.updateBalance(v.addr, v.currencyName);
            });
        });
    }

}

// ==========================本地
register('user',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.dataInit();
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
        w.pageInit();
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
