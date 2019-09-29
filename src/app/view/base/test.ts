/**
 * test
 */
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
// tslint:disable-next-line:max-line-length
import { loadAboutAppSource, loadAccountSource, loadCloudRechargeSource, loadDividendSource, loadMallSource, loadMedalSource, loadMiningSource, loadOpenBoxSource, loadRedEnvelopeSource, loadSettingSource, loadShareSource, loadTurntableSource } from './sourceLoaded';

export class Test extends Widget {
    // 开宝箱
    public open1() {
        const loading = popNew('app-components1-loading-loading1');
        loadOpenBoxSource().then(() => {
            popNew('earn-client-app-view-openBox-openBox');
            loading.callback(loading.widget);
        });
    }

     // 大转盘
    public open2() {
        const loading = popNew('app-components1-loading-loading1');
        loadTurntableSource().then(() => {
            popNew('earn-client-app-view-turntable-turntable');
            loading.callback(loading.widget);
        });
    }

    // 我的勋章
    public open3() {
        const loading = popNew('app-components1-loading-loading1');
        loadMedalSource().then(() => {
            popNew('earn-client-app-view-medal-medal');
            loading.callback(loading.widget);
        });
    }

     // 挖矿
    public open4() {
        const loading = popNew('app-components1-loading-loading1');
        loadMiningSource().then(() => {
            popNew('earn-client-app-view-mining-miningHome');
            loading.callback(loading.widget);
        });
    }

     // 分享
    public open5() {
        const loading = popNew('app-components1-loading-loading1');
        loadShareSource().then(() => {
            popNew('earn-client-app-view-share-inviteFriend');
            loading.callback(loading.widget);
        });
    }

    // 嗨豆商城
    public open6() {
        const loading = popNew('app-components1-loading-loading1');
        loadMallSource().then(() => {
            popNew('earn-client-app-view-mall-exchange');
            loading.callback(loading.widget);
        });
    }

    // 公众号 联系我们 关于好嗨 帮助
    public open7(i:number) {
        const loading = popNew('app-components1-loading-loading1');
        loadAboutAppSource().then(() => {
            if (i === 0) {
                popNew('app-view-aboutApp-wechatQrcode',{ fg:1 });
            } else if (i === 1) {
                popNew('app-view-aboutApp-contanctUs');
            } else if (i === 2) {
                popNew('app-view-aboutApp-aboutus');
            } else if (i === 3) {
                popNew('app-view-aboutApp-help');
            }
            
            loading.callback(loading.widget);
        });
    }

     // 发红包 开红包
    public open8(i:number) {
        const loading = popNew('app-components1-loading-loading1');
        loadRedEnvelopeSource().then(() => {
            if (i === 0) {
                popNew('app-view-redEnvelope-writeRedEnv');
            } else {
                popNew('app-view-redEnvelope-exchange');
            }
            
            loading.callback(loading.widget);
        });
    }

    // 分红
    public open9(i:number) {
        const loading = popNew('app-components1-loading-loading1');
        loadDividendSource().then(() => {
            popNew('app-view-dividend-dividend');
            
            loading.callback(loading.widget);
        });
    }

    // 云端充值
    public open10() {
        const loading = popNew('app-components1-loading-loading1');
        loadCloudRechargeSource().then(() => {
            popNew('app-view-cloudRecharge-home',{ currencyName:'SC',gain:0 });
            
            loading.callback(loading.widget);
        });
    }

    // 账户信息
    public open11() {
        const loading = popNew('app-components1-loading-loading1');
        loadAccountSource().then(() => {
            popNew('app-view-account-home');
            
            loading.callback(loading.widget);
        });
    }

    // 设置
    public open12() {
        const loading = popNew('app-components1-loading-loading1');
        loadSettingSource().then(() => {
            popNew('app-view-setting-setting');
            
            loading.callback(loading.widget);
        });
    }
}