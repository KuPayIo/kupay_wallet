/**
 * wallet home 
 */
// ==============================导入
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { OfflienType } from '../../../components1/offlineTip/offlineTip';
// tslint:disable-next-line:max-line-length
import { callFetchCloudTotalAssets,callFetchCloudWalletAssetList, callFetchLocalTotalAssets,callFetchWalletAssetList, getStoreData } from '../../../middleLayer/wrap';
import { getModulConfig } from '../../../publicLib/modulConfig';
import { formatBalanceValue } from '../../../publicLib/tools';
import { getCurrencyUnitSymbol } from '../../../utils/tools';
import { registerStoreData } from '../../../viewLogic/common';
import { logoutWallet } from '../../../viewLogic/login';
// ============================导出

// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class Home extends Widget {
    public create() {
        super.create();
        const isIos = getModulConfig('IOS');
        let tabs;
        if (isIos) {
            tabs = [{
                tab:{ zh_Hans:'账户',zh_Hant:'賬戶',en:'' },
                components:'app-view-wallet-home-cloudHome'
            },{
                tab:{ zh_Hans:'行情',zh_Hant:'行情',en:'' },
                components:'app-view-wallet-home-walletHome'
            }];
        } else {
            tabs = [{
                tab:{ zh_Hans:'云账户',zh_Hant:'雲賬戶',en:'' },
                components:'app-view-wallet-home-cloudHome'
            },{
                tab:{ zh_Hans:'本地钱包',zh_Hant:'本地錢包',en:'' },
                components:'app-view-wallet-home-walletHome'
            }];
        }
        this.props = {
            offlienType:OfflienType.WALLET,
            tabs,
            activeNum:0,
            refreshing:false,
            localTotalAssets:0,
            localWalletAssetList:[],
            cloudTotalAssets:0,
            cloudWalletAssetList:[],
            totalAsset:'0.00',
            currencyUnitSymbol:'￥',
            redUp:true
        };
        this.dataInit();
    }
    public setProps(props:any,oldProps:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props,oldProps);
        
    }

    public dataInit() {
        this.updateCloudWalletAssetList();
        this.updateLocalWalletAssetList();
        this.changeColor();
        this.updateCurrencyUnitSymbol();
    }

    public tabsChangeClick(event: any, value: number) {
        this.props.activeNum = value;
        this.paint();
    }

    // 更新余额
    public updateTotalAsset() {
        callFetchCloudTotalAssets().then(cloudTotalAssets => {
            this.props.totalAsset = formatBalanceValue(this.props.localTotalAssets + cloudTotalAssets);
            this.props.cloudTotalAssets = cloudTotalAssets;
            this.paint();
        });
        callFetchLocalTotalAssets().then(localTotalAssets => {
            this.props.totalAsset = formatBalanceValue(localTotalAssets + this.props.cloudTotalAssets);
            this.props.localTotalAssets = localTotalAssets;
            this.paint();
        });
    }

    // 更新云端资产
    public updateCloudWalletAssetList() {
        callFetchCloudTotalAssets().then(cloudTotalAssets => {
            this.props.totalAsset = formatBalanceValue(this.props.localTotalAssets + cloudTotalAssets);
            this.props.cloudTotalAssets = cloudTotalAssets;
            this.paint();
        });
        callFetchCloudWalletAssetList().then(assetList => {
            this.props.cloudWalletAssetList = assetList;
            this.paint();
        });
    }

    // 更新本地资产
    public updateLocalWalletAssetList() {
        callFetchLocalTotalAssets().then(localTotalAssets => {
            this.props.totalAsset = formatBalanceValue(localTotalAssets + this.props.cloudTotalAssets);
            this.props.localTotalAssets = localTotalAssets;
            this.paint();
        });
        callFetchWalletAssetList().then(assetList => {
            this.props.localWalletAssetList = assetList;
            this.paint();
        });
    }

    // 涨跌幅颜色改变
    public changeColor() {
        getStoreData('setting/changeColor','redUp').then(color => {
            this.props.redUp = color === 'redUp';
            this.paint();
        });
    }

    // 货币单位改变
    public currencyUnitChange() {
        this.updateCurrencyUnitSymbol();
        this.updateTotalAsset();
        
    }

    // 货币符号改变
    public updateCurrencyUnitSymbol() {
        getCurrencyUnitSymbol().then(currencyUnitSymbol => {
            this.props.currencyUnitSymbol = currencyUnitSymbol; 
            this.paint();
        });
    }
    
}

// ==========================本地

// 货币涨跌幅度变化
registerStoreData('third/currency2USDTMap',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateTotalAsset();
    }
});
// 货币单位变化
registerStoreData('setting/currencyUnit',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.currencyUnitChange();
    }
});

// 涨跌幅颜色变化
registerStoreData('setting/changeColor', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.changeColor();
    }
});

// 云端余额变化
registerStoreData('cloud/cloudWallets',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateCloudWalletAssetList();
    }
});

// 钱包记录变化
registerStoreData('wallet',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateLocalWalletAssetList();
    }
});

logoutWallet(() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
        w.paint();
    }
});